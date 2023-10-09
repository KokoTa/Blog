#!/usr/bin/env sh
###
 # @Author: KokoTa
 # @Date: 2023-10-09 17:54:55
 # @LastEditTime: 2023-10-09 17:57:16
 # @LastEditors: KokoTa
 # @Description: 
### 

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:KokoTa/blog.git master:gh-pages

cd -