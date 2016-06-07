#!/bin/bash
export JAVA_HOME="/usr/lib/jvm/java-8-oracle"
export SITS_HOME="/home/$USER/SITS"
$JAVA_HOME/bin/java -jar $SITS_HOME/WSProxy.jar --config