---
title: "搜索"
featured_image: "/images/arctic_hr.JPG"
description: 搜索你感兴趣的文章、工具与话题
---

<div style="max-width:760px;margin:0 auto;padding:2rem 1rem;">

  <p style="color:#555;font-size:17px;">
    只是站在了巨人的肩膀上
  </p>

  <div id="search-app" style="margin-top:1.5rem;">
    <input
      id="search-input"
      type="text"
      placeholder="搜索文章标题、摘要、标签…（按 / 快速聚焦）"
      style="
        width:100%;
        padding:14px 16px;
        font-size:16px;
        border-radius:12px;
        border:1px solid #ddd;
        outline:none;
        transition:all .2s ease;
        box-sizing:border-box;
      "
      onfocus="this.style.borderColor='#999'"
      onblur="this.style.borderColor='#ddd'"
    >
    <div id="search-meta" style="margin-top:1rem;font-size:14px;color:#888;"></div>
    <div id="search-results" style="margin-top:1.5rem;"></div>
  </div>
</div>

<script src="/js/search.js"></script>