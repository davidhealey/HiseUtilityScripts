namespace ObjectHelpers
{
  inline function keyExists(obj, key)
  {
    return !(obj[key] == void); // Important: not undefined!
  }

  inline function getSize(obj)
  {
    local count = 0;

    for (k in obj)
    {
      count++;
    }
    return count;
  }

  inline function getPropertyByIndex(obj, index)
  {
    local count = 0;

    for (k in obj)
    {
      if (count == index)
        return obj[k];

      count++;
    }
  }

  inline function getIndexByProperty(obj, prop)
  {
    local count = 0;

    for (k in obj)
    {
      if (k == prop) return count;
      count++;
    }
    return -1;
  }
}
