#!/bin/bash
if [[ -z $1 ]]; then
  echo "No notification ID specified.";
  else
  curl localhost/$1/$2
fi


