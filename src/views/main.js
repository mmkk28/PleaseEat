// ── Navigation ──────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'))
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
  document.getElementById('page-' + name).classList.remove('hidden')
  document.querySelector(`[onclick="showPage('${name}')"]`).classList.add('active')
}

// ── Loading state ────────────────────────────────────────────
function setLoading(btnId, loading, loadingText = 'Loading…') {
  const btn = document.getElementById(btnId)
  btn.disabled = loading
  btn.textContent = loading ? loadingText : btn.dataset.label
}

document.addEventListener('DOMContentLoaded', () => {
  ['btn-load', 'btn-create'].forEach(id => {
    const btn = document.getElementById(id)
    if (btn) btn.dataset.label = btn.textContent
  })
})

// ── See All Recipes ──────────────────────────────────────────
async function loadRecipes() {
  setLoading('btn-load', true)
  const list = document.getElementById('recipe-list')
  list.innerHTML = ''
  try {
    const res = await fetch('/recipe')
    const data = await res.json()

    if (!res.ok) {
      list.innerHTML = `<p class="empty-state error-state">Error ${res.status}: ${data.message || 'Failed to load recipes.'}</p>`
      return
    }

    renderRecipes(data)
  } catch (e) {
    list.innerHTML = `<p class="empty-state error-state">Could not reach the server. Is it running?</p>`
  } finally {
    setLoading('btn-load', false)
  }
}

function renderRecipes(data) {
  const list = document.getElementById('recipe-list')
  const recipes = Array.isArray(data) ? data : data.recipe ?? []

  if (!recipes.length) {
    list.innerHTML = '<p class="empty-state">No recipes yet. Go create one!</p>'
    return
  }

  list.innerHTML = recipes.map(r => `
    <div class="recipe-card">
      <h3>${escHtml(r.title)}</h3>
      <div class="recipe-meta">
        ${r.prepTime != null ? `<span class="meta-pill">Prep ${r.prepTime}m</span>` : ''}
        ${r.cookTime != null ? `<span class="meta-pill">Cook ${r.cookTime}m</span>` : ''}
        ${r.servings != null ? `<span class="meta-pill">Serves ${r.servings}</span>` : ''}
      </div>
      <span class="recipe-section-title">Ingredients</span>
      <ul>${r.ingredients.map(i => `<li>${escHtml(i)}</li>`).join('')}</ul>
      <span class="recipe-section-title">Instructions</span>
      <p class="instructions">${escHtml(r.instructions)}</p>
    </div>
  `).join('')
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Create Recipe ────────────────────────────────────────────
async function submitCreate(event) {
  event.preventDefault()
  setLoading('btn-create', true, 'Creating…')

  const title        = document.getElementById('f-title').value.trim()
  const ingredients  = document.getElementById('f-ingredients').value
    .split('\n').map(l => l.trim()).filter(Boolean)
  const instructions = document.getElementById('f-instructions').value.trim()
  const prepTime     = document.getElementById('f-prep').value
  const cookTime     = document.getElementById('f-cook').value
  const servings     = document.getElementById('f-servings').value

  const body = { title, ingredients, instructions }
  if (prepTime)  body.prepTime  = Number(prepTime)
  if (cookTime)  body.cookTime  = Number(cookTime)
  if (servings)  body.servings  = Number(servings)

  try {
    const res  = await fetch('/recipe/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()

    if (res.ok) {
      showFeedback('success', data.message || 'Recipe created!')
      event.target.reset()
    } else {
      showFeedback('error', data.message || 'Something went wrong.')
    }
  } catch (e) {
    showFeedback('error', e.message)
  } finally {
    setLoading('btn-create', false)
  }
}

function showFeedback(type, message) {
  const el = document.getElementById('form-feedback')
  el.textContent = message
  el.className = `feedback ${type}`
}
