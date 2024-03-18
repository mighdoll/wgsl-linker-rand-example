# wgsl-linker-blitz

[wgsl linker]: https://github.com/mighdoll/wgsl-linker-rand-example

An example project using the [wgsl linker]().

The [wgsl linker]() allows you to combine wgsl source code from multiple files.
This example demonstrates importing a function from a utility library 
exporting a random number generator. 

Note that the utility library contains a function name that conflicts with the main source.
The [wgsl-linker]() rewrites the code to avoid the conflict.

[Run/Edit in StackBlitz](https://stackblitz.com/~/github.com/mighdoll/wgsl-linker-rand-example)


