# wgsl-linker  random example

[wgsl linker]: https://github.com/mighdoll/wgsl-linker-rand-example
[pcg]: https://www.pcg-random.org/using-pcg.html

The [wgsl linker] allows you to combine wgsl source code from multiple files.
This example demonstrates importing a function from a utility library
exporting a [PCG] random number generator.

Note that the utility library contains a function named 'mixing' that conflicts with the main source.
Part of the job of the [wgsl linker] is to rewrite the code as necessary to avoid name conflicts. 

[Run/Edit in StackBlitz](https://stackblitz.com/~/github.com/mighdoll/wgsl-linker-rand-example)
