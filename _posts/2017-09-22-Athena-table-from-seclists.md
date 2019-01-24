---
title: Making an Athena table from the SecLists repo
thumbnail: "user-shield"
categories: [secops]
tags: [db, ops, secops]
---

If you're into web security, you have hopefully heard of <a href="https://github.com/danielmiessler/SecLists">SecLists</a>. It's an amazing repository of keywords, indicators, payloads, passwords and more. It's great not just for SecOps, but also developers and QA who want to step up their security game.

As part of a project I'm working on, I wanted to be able to quickly compare strings in the <code>Discovery/Web_Content</code> files against logs I have regularly synched to <a href="https://aws.amazon.com/s3/">AWS S3</a> (specifically, ELB logs for my SaaS platform). In order to find interesting data in those logs, I've already created <a href="https://aws.amazon.com/athena/">Athena</a> tables, so I just need a new table for this content. So I wrote a quick script that fetches the SecLists repo, copies it up to S3, then generates an Athena table.

This gist shows how to make the whole repo searchable, but it's worth noting that there are README files and other content in there you <em>don't</em> want to query (including GIFs and other binaries). So it's a good idea to restrict your queries to subfolders using the <code>$path</code> metavariable, or CREATE your table using that subfolder in the <code>LOCATION</code> path. (For example, since I'm only interested in web content, I gave that full path in my <code>CREATE TABLE</code> statement.)

What's rad about this is that (a) it's searchable using standard SQL, (b) I can compare strings to other data files using Athena, and (c) I only incur access/query charges when I run my queries, rather than having an always-on database instance.

<a href="https://twitter.com/angrychimp">Let me know on Twitter</a> what you're using Athena for!

<script src="https://gist.github.com/angrychimp/3b6efb260524a38f2c544b2ee83d0028.js"></script>

 