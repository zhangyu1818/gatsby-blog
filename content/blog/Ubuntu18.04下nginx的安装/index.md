---
title: Ubuntu18.04下nginx的安装
date: "2019-05-09"
description: ""
---

域名到期了，把东西都迁移回成都的服务器，只是成都的服务器是`apache`搭的`wordpress`，一气之下重装系统，换`nginx`

之前找网上的教程，没想到好多都是错的，官网一看，原来有[官方教程](http://nginx.org/en/linux_packages.html#Ubuntu)

## 安装

1. `sudo apt install curl gnupg2 ca-certificates lsb-release`
2. ```shell
    echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
   ```
3. ```shell
   echo "deb http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
   | sudo tee /etc/apt/sources.list.d/nginx.list
   ```
4. `curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -`
5. `sudo apt-key fingerprint ABF5BD827BD9BF62`,这里会给一个验证
6. `sudo apt update`
7. `sudo apt install nginx`

接着就是漫长的等待，之前的谷歌云都是秒下，真是快啊…

> By default, the configuration file is named nginx.conf and placed in the directory /usr/local/nginx/conf, /etc/nginx, or /usr/local/etc/nginx.

配置文件我是直接修改的/etc/nginx/conf.d/里的 default.conf
