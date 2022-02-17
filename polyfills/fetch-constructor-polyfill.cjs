module.exports = {
  context: () => {
    const _fetch = async (resource, init) => {
      const ret = await fetch(resource, init);
      // response in @adobe/helix-fetch has a `buffer` method.
      ret.buffer = async () => {
        return Buffer.from(await ret.arrayBuffer());
      };
      return ret;
    }

    return { 
      fetch: _fetch,
      reset: () => {},
    };
  },
}
