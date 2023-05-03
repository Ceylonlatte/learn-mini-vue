export function shouldUpdateComponent(prevVNode, nextVNnode) {
  const { props: prevProps } = prevVNode;
  const { props: nextProps } = nextVNnode;

  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }

  return false;
}
