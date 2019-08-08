#!/usr/bin/env bash
set -ex
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get install -y libcurl4-openssl-dev libxml2-dev libmagickwand-dev
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get -y install yarn
gem install bundler -v 2.0.1
# install
bundle install
# script

yarn ci