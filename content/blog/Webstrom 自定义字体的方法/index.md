---
title: Webstrom 自定义字体的方法
date: "2018-10-02"
description: ""
---

折腾了一晚上，字体装在系统里了，Office都能用，但是Webstrom就是找不到，百度也无果啊，最后stackoverflow一查就查出来了

> Fonts are rendered by the JVM, so it shows any TTF fonts that it can find. If for some reason not all your system TTF fonts are visible, you need to copy *.ttf files into JDK_HOME/jre/lib/fonts. After restarting IDEA you'll be able to choose new fonts. Fonts missing some Unicode characters required for proper code display will not be listed.

看了这段话，我以为只有Java用IDEA，才会有`JDK_HOME/jre/lib/fonts`,尝试性的打开我的Webstrom目录，诶，竟然真的有jre文件夹！惊喜~
哗哗哗找了一堆支持连写的字体，谁叫我就是喜欢箭头函数呢
终于能有和大佬一样的编程体验了！
存钱存钱，飞利浦499P9H1我来啦~屋子放不下怎么办，还是存钱买房好了
