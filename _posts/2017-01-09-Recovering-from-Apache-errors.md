---
title: Recovering from Apache "400 Bad Request" errors
thumbnail: exclamation-circle
categories: [coding]
tags: [apache, database, web, troubleshooting, devops, site-reliability]
---

You never want to encounter errors in your production environment. But what do you do if you release code that generates fatal errors outside your application?

A recent release we deployed caused an issue with links our platform was generating. Instead of nice links like this:
<code>http://example.com/foo:bar:baz</code>
we started seeing links like:
<code>http://example.com/foo:bar:%?baz?%</code>

The source of the issue was easy enough to track down. We use "%%" to wrap replacement variables for our email templates, and when a variable can't be identified, we re-wrap the name with "%?". (It's arguable we shouldn't do that, but that's a topic for a later discussion.) Rolling back the change fixed the issue for future generated emails, but what to do about the old emails? They're already in inboxes world-wide, and we can't fix the URI for those links.

When Apache receives a request in this format, where you have a percent sign followed by a non-alphanumeric tuple, it panics. It's thinking that the %-sign is there to URL-encode something. When you follow a %-sign with a question mark, it generates a parse error, and throws a "400 Bad Request". You can't use <code>mod-rewrite</code> because the error occurs before rewrite rules are processed. But Apache does give you one opportunity to rewrite history (so to speak): <a href="https://httpd.apache.org/docs/current/mod/core.html#errordocument"><code>ErrorDocument</code></a>.

We were able to quickly deploy a new script to production, and set the path to that script as the <code>ErrorDocument</code> handler for HTTP 400 responses.
<pre># In /etc/httpd/conf.d/my-app.conf
...
ErrorDocument 400 /error/400.php
...</pre>
Apache will redirect the request to that page, with the URI intact. It'll even still load your other modules, including (in this case) the PHP processor. So in that <code>400.php</code> script, we parse the URI, look for the bad string, and simply rewrite (or remove) it.
<pre><?php

if (strpos($_SERVER['REQUEST_URI'], '%?') !== false) {
    $uri = str_replace('%', '%25', $_SERVER['REQUEST_URI']);
    header('Location: ' . $uri);
    exit;
}

echo "This server has encountered an error.";</pre>
Et voila. It's not the perfect user experience, since those values weren't replaced in transit like they should have been. But at least the email recipients clicking on the links aren't getting standard "400 Bad Request" error pages. It was a tidy little solution to what could have been a devastating problem.