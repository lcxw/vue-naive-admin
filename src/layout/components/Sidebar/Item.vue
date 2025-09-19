<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(h("svg-icon", {
        props: {
          iconClass: icon
        }
      }));
    }

    if (title) {
      if (title.length > 5) {
        vnodes.push(h("span", {
          slot: "title",
          title
        }, title));
      } else {
        // 把下面的jsx写法换成render函数写法或者普通vue写法
        vnodes.push(h("span", {
          slot: "title"
        }, title));
      }
    }
    return vnodes
  },
}
</script>
