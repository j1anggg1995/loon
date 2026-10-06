/*
 * Soul 去广告 · 响应清洗脚本
 * 作用：删除 Soul 接口返回 JSON 中明确的广告字段。
 * 保守策略：只删以 ad/splash/advert 开头的 key；解析失败或非 JSON 时原样返回，不影响 App。
 */
try {
  const raw = $response.body;
  if (!raw) $done({});

  const obj = JSON.parse(raw);
  const AD_KEY = /^(ad|splash|advert)/i;

  function clean(node) {
    if (Array.isArray(node)) return node.map(clean);
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) {
        if (AD_KEY.test(k)) {
          delete node[k];
        } else {
          node[k] = clean(node[k]);
        }
      }
    }
    return node;
  }

  $done({ body: JSON.stringify(clean(obj)) });
} catch (e) {
  // 解析失败：原样返回，保证不破坏正常功能
  $done({});
}
