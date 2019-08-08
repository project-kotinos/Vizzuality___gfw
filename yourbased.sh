#!/usr/bin/env bash
set -ex
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get install libcurl4
gem install bundler -v 2.0.1
# install
bundle install
# script
yarn ci