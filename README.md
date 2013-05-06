Kokou
============================================================

Kokou is a utility library that is cultivated from useful
things that have withstood the test of time and value. It is
used in its sister "wabi-sabi" libraries: Yugen, Kanso, etc.


Project Status
------------------------------------------------------------

Unstable; in development.


Design Philosophy
------------------------------------------------------------

Kokou follows my "wabi-sabi" design philosphy:

Mixin, Object, Delegate, Compose (MODC)

This style promotes several concepts:

* Create simple objects that perform a specific function.
* Provide a companion mixin, if possible, to provide
  flexibility to create new types of objects.
* Use differential overrides, where the non-overrides
  are delegated to the prototypical object.
* Use composition for more complex behavior.

By using these principles, you have extreme flexibility
to create many combinations of objects and allow the end
user to adapt the functionality to their own specific
use case.


**Mixins**
I use the "verb" style of mixin with an applied context
(using "call") to link cached functions for performance.

Because I do not rely on constructors, due to the extensive
use of mixins, each mixin defines an init function that
sets up the required properties the mixin requires. The
init function should be labeled after the mixin's
functionality, such as: initAttr, initEmitter, etc. This
allows you to create a factory function to do a specific
initialization, or allows the end user to manually init
each functionality separately.

The data for each mixin is stored in a specific data property
so that there will be very few conflicts. This also allows
mixins to use the same property names if they want.

_Example_:
myObj.data['attr'].foo
myObj.data['emitter'].foo

Each mixin creates its own entry in the common data object.
