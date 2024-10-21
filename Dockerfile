FROM denoland/deno:1.46.1

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN rm -fr node_modules _fresh 

RUN deno task build

RUN chown -R deno:deno /app /deno-dir

USER deno

RUN deno cache --reload main.ts

CMD ["run", "-A", "main.ts"]