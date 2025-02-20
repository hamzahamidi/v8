// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --experimental-wasm-mv

load("test/mjsunit/wasm/wasm-module-builder.js");

(function MultiBlockResultTest() {
  print("MultiBlockResultTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_ii_v = builder.addType(kSig_ii_v);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprBlock, sig_ii_v,
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprEnd,
      kExprI32Add])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(1, 4), 5);
})();

(function MultiBlockParamTest() {
  print("MultiBlockParamTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprBlock, sig_i_ii,
      kExprI32Add,
      kExprEnd])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(1, 4), 5);
})();

(function MultiBlockBrTest() {
  print("MultiBlockBrTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_ii_v = builder.addType(kSig_ii_v);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprBlock, sig_ii_v,
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprBr, 0,
      kExprEnd,
      kExprI32Add])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(1, 4), 5);
})();


(function MultiLoopResultTest() {
  print("MultiLoopResultTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_ii_v = builder.addType(kSig_ii_v);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprLoop, sig_ii_v,
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprEnd,
      kExprI32Add])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(1, 4), 5);
})();

(function MultiLoopParamTest() {
  print("MultiLoopParamTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprLoop, sig_i_ii,
      kExprI32Add,
      kExprEnd])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(1, 4), 5);
})();

(function MultiLoopBrTest() {
  print("MultiLoopBrTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_ii_i = builder.addType(kSig_ii_i);
  let sig_ii_ii = builder.addType(kSig_ii_ii);

  builder.addFunction("dup", kSig_ii_i)
    .addBody([kExprGetLocal, 0, kExprGetLocal, 0]);
  builder.addFunction("swap", kSig_ii_ii)
    .addBody([kExprGetLocal, 1, kExprGetLocal, 0]);
  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprLoop, sig_ii_ii,
      kExprCallFunction, 1,  // swap
      kExprCallFunction, 0,  // dup
      kExprI32Add,
      kExprCallFunction, 0,  // dup
      kExprI32Const, 20,
      kExprI32LeU,
      kExprBrIf, 0,
      kExprEnd,
      kExprDrop])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(0, instance.exports.main(0, 1));
  assertEquals(16, instance.exports.main(1, 1));
  assertEquals(4, instance.exports.main(3, 1));
  assertEquals(4, instance.exports.main(4, 1));
  assertEquals(0, instance.exports.main(0, 2));
  assertEquals(16, instance.exports.main(1, 2));
  assertEquals(8, instance.exports.main(3, 2));
  assertEquals(8, instance.exports.main(4, 2));
  assertEquals(0, instance.exports.main(0, 3));
  assertEquals(8, instance.exports.main(1, 3));
  assertEquals(12, instance.exports.main(3, 3));
  assertEquals(12, instance.exports.main(4, 3));
  assertEquals(0, instance.exports.main(0, 4));
  assertEquals(8, instance.exports.main(1, 4));
  assertEquals(16, instance.exports.main(3, 4));
  assertEquals(16, instance.exports.main(4, 4));
  assertEquals(3, instance.exports.main(100, 3));
  assertEquals(6, instance.exports.main(3, 100));
})();


(function MultiIfResultTest() {
  print("MultiIfResultTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_ii_v = builder.addType(kSig_ii_v);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprIf, sig_ii_v,
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprElse,
      kExprGetLocal, 1,
      kExprGetLocal, 0,
      kExprEnd,
      kExprI32Sub])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(8, 3), 5);
  assertEquals(instance.exports.main(0, 3), 3);
})();

(function MultiIfParamTest() {
  print("MultiIfParamTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprGetLocal, 0,
      kExprIf, sig_i_ii,
      kExprI32Add,
      kExprElse,
      kExprI32Sub,
      kExprEnd])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(1, 4), 5);
  assertEquals(instance.exports.main(0, 4), -4);
})();

(function MultiIfBrTest() {
  print("MultiIfBrTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_ii_v = builder.addType(kSig_ii_v);

  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprIf, sig_ii_v,
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprBr, 0,
      kExprElse,
      kExprGetLocal, 1,
      kExprGetLocal, 0,
      kExprBr, 0,
      kExprEnd,
      kExprI32Sub])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(8, 3), 5);
  assertEquals(instance.exports.main(0, 3), 3);
})();

(function MultiResultTest() {
  print("MultiResultTest");
  let builder = new WasmModuleBuilder();
  let sig_i_ii = builder.addType(kSig_i_ii);
  let sig_iii_ii = builder.addType(kSig_iii_ii);

  builder.addFunction("callee", kSig_iii_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprI32Sub]);
  builder.addFunction("main", kSig_i_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprCallFunction, 0,
      kExprI32Mul,
      kExprI32Add])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(0, 0), 0);
  assertEquals(instance.exports.main(1, 0), 1);
  assertEquals(instance.exports.main(2, 0), 2);
  assertEquals(instance.exports.main(0, 1), -1);
  assertEquals(instance.exports.main(0, 2), -4);
  assertEquals(instance.exports.main(3, 4), -1);
  assertEquals(instance.exports.main(4, 3), 7);
})();

(function MultiReturnTest() {
  print("MultiReturnTest");
  let builder = new WasmModuleBuilder();
  let sig_i_i = builder.addType(kSig_i_i);
  let sig_ii_i = builder.addType(kSig_ii_i);

  builder.addFunction("callee", kSig_ii_i)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 0,
      kExprGetLocal, 0,
      kExprI32Add,
      kExprReturn]);
  builder.addFunction("main", kSig_i_i)
    .addBody([
      kExprGetLocal, 0,
      kExprCallFunction, 0,
      kExprI32Mul])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(0), 0);
  assertEquals(instance.exports.main(1), 2);
  assertEquals(instance.exports.main(2), 8);
  assertEquals(instance.exports.main(10), 200);
})();

(function MultiBrReturnTest() {
  print("MultiBrReturnTest");
  let builder = new WasmModuleBuilder();
  let sig_i_i = builder.addType(kSig_i_i);
  let sig_ii_i = builder.addType(kSig_ii_i);

  builder.addFunction("callee", kSig_ii_i)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 0,
      kExprGetLocal, 0,
      kExprI32Add,
      kExprBr, 0]);
  builder.addFunction("main", kSig_i_i)
    .addBody([
      kExprGetLocal, 0,
      kExprCallFunction, 0,
      kExprI32Mul])
    .exportAs("main");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.main(0), 0);
  assertEquals(instance.exports.main(1), 2);
  assertEquals(instance.exports.main(2), 8);
  assertEquals(instance.exports.main(10), 200);
})();

(function MultiWasmToJSReturnTest() {
  print(arguments.callee.name);
  let builder = new WasmModuleBuilder();
  let sig_fi_if = makeSig([kWasmI32, kWasmF32], [kWasmF32, kWasmI32]);

  builder.addFunction("swap", sig_fi_if)
    .addBody([
      kExprGetLocal, 1,
      kExprGetLocal, 0])
    .exportAs("swap");
  builder.addFunction("addsubmul", kSig_iii_i)
      .addBody([
        kExprGetLocal, 0,
        kExprGetLocal, 0,
        kExprI32Add,
        kExprGetLocal, 0,
        kExprGetLocal, 0,
        kExprI32Sub,
        kExprGetLocal, 0,
        kExprGetLocal, 0,
        kExprI32Mul])
    .exportAs("addsubmul");

  let module = new WebAssembly.Module(builder.toBuffer());
  let instance = new WebAssembly.Instance(module);
  assertEquals(instance.exports.swap(0, 1.5), [1.5, 0]);
  assertEquals(instance.exports.swap(2, 3.75), [3.75, 2]);
  assertEquals(instance.exports.addsubmul(4), [8, 0, 16]);
  assertEquals(instance.exports.addsubmul(5), [10, 0, 25]);
})();

(function MultiJSToWasmReturnTest() {
  print(arguments.callee.name);
  let builder = new WasmModuleBuilder();
  function swap(x, y) { return [y, x]; }
  function swap_proxy(x, y) {
    return new Proxy([y, x], {
      get: function(obj, prop) { return Reflect.get(obj, prop); },
    });
  }
  function proxy_throw(x, y) {
    return new Proxy([y, x], {
      get: function(obj, prop) {
        if (prop == 1) {
          throw new Error("abc");
        }
        return Reflect.get(obj, prop); },
    });
  }
  function drop_first(x, y) {
    return [y];
  }
  function repeat(x, y) {
    return [x, y, x, y];
  }
  function not_receiver(x, y) {
    return 0;
  }
  function not_iterable(x, y) {
    a = [x, y];
    a[Symbol.iterator] = undefined;
    return a;
  }
  function* generator(x, y) {
    yield x;
    yield y;
  }
  function* generator_throw(x, y) {
    yield x;
    throw new Error("def");
  }

  builder.addImport('imports', 'f', kSig_ii_ii);
  builder.addFunction("main", kSig_ii_ii)
    .addBody([
      kExprGetLocal, 0,
      kExprGetLocal, 1,
      kExprCallFunction, 0])
    .exportAs("main")

  let module = new WebAssembly.Module(builder.toBuffer());

  var instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : swap } });
  assertEquals(instance.exports.main(1, 2), [2, 1]);
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : swap_proxy } });
  assertEquals(instance.exports.main(1, 2), [2, 1]);
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : generator } });
  assertEquals(instance.exports.main(1, 2), [1, 2]);

  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : drop_first } });
  assertThrows(() => instance.exports.main(1, 2), TypeError, "multi-return length mismatch");
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : repeat } });
  assertThrows(() => instance.exports.main(1, 2), TypeError, "multi-return length mismatch");
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : proxy_throw } });
  assertThrows(() => instance.exports.main(1, 2), Error, "abc");
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : not_receiver } });
  assertThrows(() => instance.exports.main(1, 2), TypeError, /not iterable/);
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : not_iterable } });
  assertThrows(() => instance.exports.main(1, 2), TypeError, /not iterable/);
  instance = new WebAssembly.Instance(module, { 'imports' : { 'f' : generator_throw } });
  assertThrows(() => instance.exports.main(1, 2), Error, "def");
})();
