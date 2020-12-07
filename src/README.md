### Folder Structure Reasoning

There should be three folders here.

```
1 API, 1 DATABASE and 1 FEATURES (nothing much functions)

The basic idea is that API will be gateway for features. 

And features will use the persist layer (a.k.a database) directly or external APIs.

API -> FEATURES -> DATABASE

So we should be able to call the features from any function on commandline too.
```