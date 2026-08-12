const docs = [
  { id:'A', title:'Agents', text:'An AI agent can reason about a goal, choose actions, use tools and observe results.' },
  { id:'B', title:'RAG', text:'Retrieval-Augmented Generation retrieves relevant external information and places that evidence into model context before generation.' },
  { id:'C', title:'MCP', text:'Model Context Protocol gives AI applications a standard way to discover and use external tools and resources.' },
  { id:'D', title:'Vector stores and databases', text:'RAG does not require one specific database. Many RAG systems store embeddings in a vector store or a database with vector search. Common options include Qdrant, Pinecone, Weaviate, Milvus, Chroma, Elasticsearch or OpenSearch, and PostgreSQL with pgvector.' },
  { id:'E', title:'Embeddings and chunking', text:'Documents are usually split into chunks. An embedding model converts each chunk into a numeric vector so semantically similar text can be retrieved.' },
  { id:'F', title:'Retrieval and reranking', text:'A retriever finds candidate chunks for a question. More advanced systems can combine keyword and vector search, then rerank the candidates before sending the best evidence to the model.' }
];

function norm(value='') {
  return String(value).toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
}

const aliases = {
  database:['database','db','vector database','vector db','vector store','store','pgvector','pinecone','qdrant','weaviate','milvus','chroma'],
  embedding:['embedding','embeddings','vector','vectors'],
  chunking:['chunk','chunks','chunking','split document','splitting'],
  retrieval:['retrieve','retrieval','search','rerank','reranking','hybrid search'],
  mcp:['mcp','model context protocol']
};

function semanticBonus(query, doc) {
  const q = norm(query);
  let bonus = 0;
  if (aliases.database.some(x => q.includes(x)) && doc.id === 'D') bonus += 30;
  if (aliases.embedding.some(x => q.includes(x)) && doc.id === 'E') bonus += 25;
  if (aliases.chunking.some(x => q.includes(x)) && doc.id === 'E') bonus += 25;
  if (aliases.retrieval.some(x => q.includes(x)) && doc.id === 'F') bonus += 22;
  if (aliases.mcp.some(x => q.includes(x)) && doc.id === 'C') bonus += 25;
  if (q.includes('rag') && doc.id === 'B') bonus += 8;
  return bonus;
}

function rankDocs(query) {
  const stop = new Set(['what','which','where','when','why','how','does','used','use','the','a','an','is','are','by','for','in','of','to','with','and']);
  const tokens = norm(query).split(' ').filter(t => t.length > 2 && !stop.has(t));
  return docs.map(doc => {
    const hay = norm(`${doc.title} ${doc.text}`);
    const lexical = tokens.reduce((score, token) => score + (hay.includes(token) ? 3 : 0), 0);
    return { ...doc, score: lexical + semanticBonus(query, doc) };
  }).sort((a,b) => b.score - a.score);
}

function answerFor(query, ranked) {
  const q = norm(query);
  if (aliases.database.some(x => q.includes(x))) {
    return 'RAG does not use one mandatory database. A common design stores document embeddings in a vector store or a database that supports vector search. Examples include Qdrant, Pinecone, Weaviate, Milvus, Chroma, Elasticsearch/OpenSearch, or PostgreSQL with pgvector. This browser playground itself uses no database: the sample chunks are stored directly in JavaScript memory.';
  }
  if (aliases.embedding.some(x => q.includes(x))) {
    return 'Embeddings are numeric representations of chunks. They let the retriever compare the meaning of a question with the meaning of stored text, which is why vector search is common in RAG systems.';
  }
  if (aliases.chunking.some(x => q.includes(x))) {
    return 'Chunking splits source documents into smaller passages before indexing. Good chunk sizes preserve enough context for meaning while keeping retrieval focused.';
  }
  if (aliases.retrieval.some(x => q.includes(x))) {
    return 'Retrieval is the step that finds evidence for the question. A production RAG system may use vector search, keyword search, hybrid search and reranking before sending the strongest chunks to the model.';
  }
  if (q.includes('mcp')) {
    return 'MCP and RAG solve different problems. RAG retrieves evidence for generation, while MCP is a protocol for exposing tools and resources to AI applications.';
  }
  if (!ranked.length || ranked[0].score <= 0) {
    return 'This tiny knowledge base does not contain enough evidence to answer that question. A reliable RAG system should surface that limitation instead of inventing an answer.';
  }
  return `Based on the strongest retrieved evidence: ${ranked[0].text}`;
}

function renderResult(query) {
  const result = document.querySelector('[data-rag-result]');
  if (!result) return;
  const ranked = rankDocs(query);
  const answer = answerFor(query, ranked);
  const evidence = ranked.slice(0,3);

  result.innerHTML = `
    <span class="eyebrow">RAG RESPONSE</span>
    <div class="rag-answer-box">
      <strong>Answer</strong>
      <p>${escapeHtml(answer)}</p>
    </div>
    <div class="rag-evidence-list">
      <strong>Retrieved evidence</strong>
      ${evidence.map((doc,index)=>`<div class="ranked-chunk"><strong>#${index+1} Chunk ${doc.id} · ${escapeHtml(doc.title)}</strong><span>${doc.score} relevance signals</span><p>${escapeHtml(doc.text)}</p></div>`).join('')}
    </div>`;
}

function enhanceRagLab() {
  const form = document.querySelector('[data-rag-form]');
  if (!form || form.dataset.upgraded === 'true') return;
  form.dataset.upgraded = 'true';

  const heading = form.closest('.lab-main')?.querySelector('h2');
  if (heading) heading.textContent = 'Ask a tiny RAG system';

  const intro = form.closest('.lab-main')?.querySelector('h2 + p');
  if (intro) intro.textContent = 'Ask a question. The playground retrieves the closest local evidence, answers from that evidence, and shows what it used. It runs fully in your browser.';

  const button = form.querySelector('button');
  if (button) button.textContent = 'Retrieve & answer →';

  const docsWrap = form.closest('.lab-main')?.querySelector('.rag-docs');
  if (docsWrap) {
    docsWrap.innerHTML = docs.map(doc => `<article data-rag-doc><strong>Chunk ${doc.id} · ${escapeHtml(doc.title)}</strong><p>${escapeHtml(doc.text)}</p></article>`).join('');
  }

  const note = document.createElement('div');
  note.className = 'rag-demo-note';
  note.innerHTML = '<strong>About this demo</strong><span>No real vector database or LLM is used here. Retrieval and answers are simulated locally so you can inspect every step.</span>';
  docsWrap?.insertAdjacentElement('afterend', note);
}

function addStyles() {
  if (document.querySelector('#rag-lab-upgrade-styles')) return;
  const style = document.createElement('style');
  style.id = 'rag-lab-upgrade-styles';
  style.textContent = `
    .rag-demo-note{display:flex;gap:10px;align-items:flex-start;margin:14px 0;padding:12px 14px;border:1px solid var(--line);border-radius:14px;background:var(--surface-soft);font-size:14px}
    .rag-demo-note span{color:var(--muted)}
    .rag-answer-box{margin:10px 0 16px;padding:16px;border-radius:16px;background:var(--blue-soft);border:1px solid #cfddff}
    .rag-answer-box p{margin:6px 0 0;line-height:1.55}
    .rag-evidence-list>strong{display:block;margin-bottom:8px}
  `;
  document.head.appendChild(style);
}

document.addEventListener('submit', event => {
  if (!event.target.matches('[data-rag-form]')) return;
  const query = String(new FormData(event.target).get('query') || '');
  setTimeout(() => renderResult(query), 0);
}, true);

let scheduled = false;
function enhance() {
  scheduled = false;
  addStyles();
  enhanceRagLab();
}
function scheduleEnhance() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(enhance);
}
const app = document.querySelector('#app');
if (app) new MutationObserver(scheduleEnhance).observe(app,{childList:true,subtree:true});
window.addEventListener('hashchange',scheduleEnhance);
scheduleEnhance();
