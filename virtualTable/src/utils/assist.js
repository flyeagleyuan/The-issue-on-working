/**
 * 向上查找离得最近的指定name的Vue组件对象
 * @param context 当前上下文
 * @param componentName 组件名
 * @return {Vue}
 */
export function findComponentUpward(context, componentName) {
  let parent = context.$parent,
    name = parent.$options.name;

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.name;
    }
  }

  return parent;
}

/**
 * 向上查找所有指定name的Vue组件对象
 * @param context 当前上下文
 * @param componentName 组件名
 * @return {Vue[]|Array} 找到的对象数组
 */
export function findComponentsUpward(context, componentName) {
  let parents = [];
  const parent = context.$parent;

  if (parent) {
    if (parent.$options.name === componentName) {
      parents.push(parent);
    }
    return [...parents, ...findComponentsUpward(parents, componentName)];
  } else {
    return [];
  }
}

/**
 * 向下查找离得最近的指定name的Vue组件对象
 * @param context 当前上下文
 * @param componentName 组件名
 * @return {Vue | null}
 */
export function findComponentDownward(context, componentName) {
  const children = context.$children;

  if (children.length) {
    for (const child of children) {
      const name = child.$options.name;

      if (name === componentName) {
        return child;
      } else {
        const cld = findComponentDownward(child, componentName);
        if (cld) {
          return cld;
        }
      }
    }
  }
  return null;
}

/**
 * 向下查找所有指定name的Vue组件对象
 * @param context 当前上下文
 * @param componentName 组件名
 * @return {Vue[]|Array} 找到的对象数组
 */
export function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) {
      components.push(child);
    }
    const foundedChild = findComponentsDownward(child, componentName);
    return [...components, ...foundedChild];
  }, []);
}

/**
 * 查找当前所有指定name的Vue组件的兄弟组件对象
 * @param context 当前上下文
 * @param componentName 组件名
 * @param exceptMe 是否排除当前组件对象
 * @return {Vue[]|Array} 找到的对象数组
 */
export function findBrothersComponents(context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName;
  });
  let index = res.findIndex(r => r._uid === context._uid);
  if (exceptMe) {
    res.splice(index, 1);
  }
  return res;
}
