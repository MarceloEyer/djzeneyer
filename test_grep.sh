#!/bin/bash
STATIC=$(grep -oP "\\\$pattern = '\K[^']+" inc/ssr-handler.php)
echo "STATIC is: $STATIC"
