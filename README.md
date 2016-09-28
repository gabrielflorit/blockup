# blockup

Scaffold and serve html, specifically focused on [bl.ocks](https://bl.ocks.org/). Go from idea to block from the comfort of your own text editor.

## why?

[bl.ocks](https://bl.ocks.org/) is a great tool! But using the [Gist site](https://gist.github.com/) as a text editor is no fun. This little tool tries to help making blocks just a tiny bit easier:
- one command, `blockup`, scaffolds and serves a new block
- write ES6 and it will get compiled down to ES5

That's it for now. It probably won't grow beyond this. I just want a tool that will let me create a block as fast as possible (and that means using ES6 because its syntax saves me time).

## usage

```sh
Usage: blockup <command>

Commands:
  new    scaffold and serve a new block (default if directory is empty)
  serve  serve current block (default if directory is not empty)

Options:
  -h, --help  Show help                                                [boolean]

v0.0.4
```

## install

` npm install -g blockup`

## related

- https://github.com/1wheel/gist-snap: snapshot thumbnails for [bl.ocks.org](http://bl.ocks.org/)
- https://github.com/mbostock/gistup: create a gist from the command line
