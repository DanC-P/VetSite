#!/bin/bash
python manage.py migrate
gunicorn VetSite.wsgi:application --bind 0.0.0.0:$PORT