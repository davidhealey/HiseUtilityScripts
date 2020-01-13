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
  
  inline function cartesianProduct(array)
  {
      local i;
      local j;
      local k;
    
      local result = [[]];

      for (i = 0; i < array.length; i++)
      {
          local subArray = array[i];
          local temp = [];
        
          for (j = 0; j < result.length; j++)
          {
              for (k = 0; k < subArray.length; k++)
              {
                  local c = concatArrays(result[j], [subArray[k]]);
                  temp.push(c);
              }
          }
          result = temp;
      }

      return result;
  }

  inline function concatArrays(a, b)
  {    
      local c = [];
      local i;
    
      for (i = 0; i < a.length; i++)
      {
          c[i] = a[i];
      }
    
      for (i = 0; i < b.length; i++)
      {
          c.push(b[i]);
      }
    
      return c;
  }
  
	inline function isArray(variable)
	{
	   return !(variable.length === undefined) && typeof variable != "string";
	}
}