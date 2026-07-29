FROM python:3.14-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false
ENV PIP_BREAK_SYSTEM_PACKAGES=1

WORKDIR /app

RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    libmaxminddb-dev

COPY pyproject.toml poetry.lock ./

RUN pip install --no-cache-dir poetry && \
    poetry lock && \
    poetry install --no-root --no-interaction --no-ansi

COPY . .

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]