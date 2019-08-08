#!/usr/bin/env bash
set -ex
export DEBIAN_FRONTEND=noninteractive
apt-get update
gem install bundler -v 2.0.1
# install
bundle install
# script
yarn ci