document.addEventListener("DOMContentLoaded", function () {

    let pages = [];
    let currentResults = [];
  
    // 加载索引数据
    fetch('/zh/index.json')
      .then(res => res.json())
      .then(data => {
        pages = data;
        console.log("Loaded pages:", pages.length);
      })
      .catch(err => {
        console.error("Failed to load index.json:", err);
      });
  
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
  
    if (!input || !results) {
      console.error("Search elements not found");
      return;
    }
  
    // ===== 防抖 =====
    function debounce(fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }
  
    // ===== 高亮关键词 =====
    function highlight(text, keyword) {
      if (!text) return '';
      const safe = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(`(${safe})`, 'gi');
      return text.replace(reg, `<mark>$1</mark>`);
    }
  
    // ===== 搜索主逻辑 =====
    function doSearch() {
      const q = input.value.trim().toLowerCase();
  
      if (!q) {
        results.innerHTML = '';
        return;
      }
  
    //   const matched = pages
    //     .filter(p =>
    //       (p.title && p.title.toLowerCase().includes(q)) ||
    //       (p.summary && p.summary.toLowerCase().includes(q)) ||
    //       (p.tags && p.tags.join(' ').toLowerCase().includes(q))
    //     )
    //     .sort((a, b) => new Date(b.date) - new Date(a.date));
      const matched = pages
        .map(p => {
          let score = 0;
      
          const title = (p.title || '').toLowerCase();
          const summary = (p.summary || '').toLowerCase();
          const tags = (p.tags || []).join(' ').toLowerCase();
      
          // 权重设计
          if (title.includes(q)) score += 10;    // 标题命中最重要
          if (tags.includes(q)) score += 6;      // 标签其次
          if (summary.includes(q)) score += 3;   // 摘要再次
      
          return { ...p, _score: score };
        })
        .filter(p => p._score > 0)
        .sort((a, b) => {
          // 先按相关度排序
          if (b._score !== a._score) return b._score - a._score;
          // 再按时间排序
          return new Date(b.date) - new Date(a.date);
        });

      currentResults = matched;
  
      if (matched.length === 0) {
        results.innerHTML = `<p style="color:#888;padding:1rem">没有找到相关结果</p>`;
        return;
      }
  
      results.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
          ${matched.map(p => `
            <div style="
              background:#fff;
              border-radius:14px;
              padding:24px;
              box-shadow:0 6px 18px rgba(0,0,0,.06);
              display:flex;
              flex-direction:column;
              justify-content:space-between;
            ">
  
              <div>
                <div style="font-size:12px;color:#999;margin-bottom:8px">
                  AI4S 文献 · ${p.date || ''}
                </div>
  
                <a href="${p.url}" style="text-decoration:none;color:#000">
                  <h3 style="font-size:20px;line-height:1.4;margin:0 0 12px">
                    ${highlight(p.title, q)}
                  </h3>
                </a>
  
                <p style="color:#555;line-height:1.6;font-size:15px">
                  ${highlight(p.summary || '', q)}
                </p>
              </div>
  
              <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
                <a href="${p.url}"
                   style="padding:6px 12px;border-radius:6px;border:1px solid #ddd;font-size:13px;text-decoration:none;color:#333">
                  阅读全文 →
                </a>
  
                ${p.external ? `
                  <a href="${p.external}" target="_blank"
                     style="padding:6px 12px;border-radius:6px;border:1px solid #5bb98c;background:#f0fbf6;font-size:13px;text-decoration:none;color:#167c52">
                    去公众号阅读 →
                  </a>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  
    input.addEventListener('input', debounce(doSearch, 150));

    // ===== / 键聚焦搜索框 =====
    document.addEventListener('keydown', function (e) {
        // 忽略用户正在输入时的情况
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
    
        if (e.key === '/') {
        e.preventDefault();   // 阻止浏览器默认“查找页面”
        input.focus();
        }
    });

    // ===== Enter 打开第一条搜索结果 =====
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && currentResults.length > 0) {
          const first = currentResults[0];
          window.location.href = first.url;
        }
      });
  });