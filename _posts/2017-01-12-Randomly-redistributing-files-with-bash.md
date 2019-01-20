---
layout: post
title: Randomly redistributing files with bash
thumbnail: "laptop-code"
category: coding
tags: [bash, ops, devops]
---

This was was damn confusing, but the solution is absurdly obvious. I needed to relocate a large number of files from a single source into a collection of subfolders. (These subfolders were essentially worker queues, so I wanted a roughly even distribution every time new files appeared in the source folder.)

<script src="https://gist.github.com/angrychimp/b3cd314bd0fff75ea241acf58abe6bf9.js"></script>

But I noticed that every time this executed, all my source files were ending up in the same queue folder (and not being evenly distributed). What gives?

Turns out, my call to <code>$RANDOM</code> was being executed <em>only once at runtime</em>, so that value was being set statically, and used for all subsequent <code>mv</code> commands. The Eureka moment what when I realized that as a subshell command, I need to escape my dollar-signs so that they'd be ignored by the parent shell, and translated by the child.

<script src="https://gist.github.com/angrychimp/592544a8e7fb2bfbc40918dec281f871.js"></script>

I suddenly found all my files going to the correct folders. Yet another reminder to always keep scope in mind.