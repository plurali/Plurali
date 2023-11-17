import { onBeforeUnmount, onMounted, onUnmounted, watch } from "vue";
import { Meta, defaultMeta, meta } from "../store";

const processMeta = (_meta: Partial<Meta>): Meta => {
  const pageMeta = {
    ...defaultMeta,
    ..._meta,
  };

  for (const key in pageMeta) {
    const value = pageMeta[key as keyof Meta];
    if (!value || (typeof value === "string" && value.trim().length < 1)) {
      pageMeta[key as keyof Meta] = defaultMeta[key as keyof Meta];
    }
  }

  return pageMeta;
}

const images = "#ogImage, #twitterImage";
const titles = "#ogTitle, #twtiterTitle";
const descriptions = "#metaDescription, #ogDescription, #twitterDescription";

const updateMeta = (meta: Meta) => {
  // Title
  document.title = !meta.title.trim().length ? meta.title : `${meta.title} | Plurali`;
  document.head.querySelectorAll(titles).forEach(el => el.setAttribute("content", meta.title));

  // Description
  document.head.querySelectorAll(descriptions).forEach(el => el.setAttribute("content", meta.description));

  // Image
  document.head.querySelectorAll(images).forEach(el => el.setAttribute("content", meta.imageUrl));
}

export const useMeta = () => {
  onMounted(() => {
    meta.value = defaultMeta;
  })

  onUnmounted(() => {
    meta.value = defaultMeta;
  })

  watch(meta, (meta) => {
    updateMeta(meta);
  })

  return (_meta: Partial<Meta>) => {
    meta.value = processMeta(_meta);
  };
}
