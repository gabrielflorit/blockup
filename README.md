# blockup

Scaffold and serve html, specifically focused on [bl.ocks](https://bl.ocks.org/). Go from idea to block from the comfort of your own text editor.

## why?

[bl.ocks](https://bl.ocks.org/) is a great tool! But using the [Gist site](https://gist.github.com/) as a text editor is no fun. This little tool helps you make blocks just a tiny bit faster:
- one command, `blockup`, scaffolds and serves a new block
- write ES6 and it will get compiled down to ES5
- browser reloads on file change

That's it for now. It probably won't grow beyond this. But if you have an idea, [I'd like to hear it](https://github.com/gabrielflorit/blockup/issues)!

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

`blockup` creates two files: `index.html` and `script.js`. Put your JS in `script.js`. On save, blockup will compile, uglify, minify and inline JS to the `<script id="script"></script>` tag in `index.html`. So make sure not to delete that tag!

## great! but is there a way to upload to gist from the command line?

Yes! See [gistup](https://github.com/mbostock/gistup).

## install

` npm install -g blockup`

## related

- https://github.com/1wheel/gist-snap: snapshot thumbnails for [bl.ocks.org](http://bl.ocks.org/)
- https://github.com/mbostock/gistup: create a gist from the command line
