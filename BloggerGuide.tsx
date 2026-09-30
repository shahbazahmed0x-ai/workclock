import { useState } from 'react';

interface StepProps {
  num: number;
  title: string;
  children: React.ReactNode;
}

function Step({ num, title, children }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-900/40">
        {num}
      </div>
      <div className="flex-1 pb-6 border-l border-white/08 pl-4 -ml-4 ml-0">
        <h4 className="text-white font-semibold mb-2">{title}</h4>
        <div className="text-sm text-white/60 space-y-2 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
      {label && (
        <div className="px-3 py-1.5 bg-white/05 border-b border-white/08 flex items-center justify-between">
          <span className="text-xs text-white/30 font-mono">{label}</span>
          <button
            onClick={copy}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
          >
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
        </div>
      )}
      <pre className="bg-[#0d1117] px-4 py-3 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        {code}
      </pre>
      {!label && (
        <button
          onClick={copy}
          className="w-full py-1.5 bg-white/03 text-xs text-violet-400 hover:text-violet-300 transition-colors border-t border-white/08"
        >
          {copied ? '✓ Copied!' : '⎘ Copy code'}
        </button>
      )}
    </div>
  );
}

function Badge({ color, text }: { color: string; text: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${color}`}>
      {text}
    </span>
  );
}

const iframeCode = `<div style="width:100%;max-width:720px;margin:0 auto;">
  <iframe
    src="YOUR_GITHUB_PAGES_URL"
    width="100%"
    height="800"
    frameborder="0"
    scrolling="yes"
    style="border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
  </iframe>
</div>`;



export default function BloggerGuide() {
  const [activeMethod, setActiveMethod] = useState<'github' | 'netlify'>('github');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass rounded-2xl border border-violet-500/30 p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
            📝
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg">Host on Blogger (Blogspot)</h2>
            <p className="text-sm text-white/50 mt-1">
              Blogger doesn't support modern JavaScript modules directly, but you can easily host your WorkClock app for free using GitHub Pages or Netlify, then embed it in Blogger.
            </p>
          </div>
        </div>
      </div>

      {/* Why can't we paste directly */}
      <div className="glass rounded-2xl border border-amber-500/30 p-5">
        <div className="flex gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="text-amber-300 font-semibold text-sm mb-1">Why not paste the HTML directly?</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Blogger's editor strips <code className="text-amber-300 bg-white/05 px-1 py-0.5 rounded">{'<script type="module">'}</code> tags for security reasons. Our app uses modern ES Modules (React), so it must be hosted on an external service and embedded via an <code className="text-amber-300 bg-white/05 px-1 py-0.5 rounded">{'<iframe>'}</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Method selector */}
      <div>
        <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Choose your hosting method</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveMethod('github')}
            className={`glass rounded-xl p-4 border text-left transition-all duration-200 btn-lift ${
              activeMethod === 'github'
                ? 'border-violet-500/60 bg-violet-500/10'
                : 'border-white/10 hover:border-violet-500/30'
            }`}
          >
            <div className="text-2xl mb-2">🐙</div>
            <p className="text-sm font-semibold text-white">GitHub Pages</p>
            <p className="text-xs text-white/40 mt-0.5">Free · Forever · No expiry</p>
            {activeMethod === 'github' && (
              <span className="inline-block mt-2 text-xs text-violet-400 font-semibold">✓ Selected</span>
            )}
          </button>
          <button
            onClick={() => setActiveMethod('netlify')}
            className={`glass rounded-xl p-4 border text-left transition-all duration-200 btn-lift ${
              activeMethod === 'netlify'
                ? 'border-teal-500/60 bg-teal-500/10'
                : 'border-white/10 hover:border-teal-500/30'
            }`}
          >
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-semibold text-white">Netlify Drop</p>
            <p className="text-xs text-white/40 mt-0.5">Free · Instant · No account needed</p>
            {activeMethod === 'netlify' && (
              <span className="inline-block mt-2 text-xs text-teal-400 font-semibold">✓ Selected</span>
            )}
          </button>
        </div>
      </div>

      {/* === GITHUB PAGES METHOD === */}
      {activeMethod === 'github' && (
        <div className="glass rounded-2xl border border-white/08 overflow-hidden">
          <div className="px-5 py-4 bg-white/03 border-b border-white/08 flex items-center gap-3">
            <span className="text-xl">🐙</span>
            <div>
              <h3 className="text-white font-semibold font-display">Method 1: GitHub Pages</h3>
              <p className="text-xs text-white/40">100% free, permanent hosting at username.github.io</p>
            </div>
          </div>
          <div className="p-5 space-y-5">

            <Step num={1} title="Download the built app">
              <p>
                After building the project (running <code className="text-violet-300 bg-white/05 px-1 py-0.5 rounded">npm run build</code>), you'll get a single file:
              </p>
              <div className="flex items-center gap-2 mt-2 p-3 bg-white/05 rounded-xl border border-white/08">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-white text-xs font-mono font-semibold">dist/index.html</p>
                  <p className="text-white/30 text-xs">~247 KB · All-in-one file</p>
                </div>
              </div>
            </Step>

            <Step num={2} title="Create a GitHub account & new repository">
              <p>Go to <a href="https://github.com" target="_blank" className="text-violet-400 underline">github.com</a> → Sign up or Sign in → Click <strong className="text-white">New Repository</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
                <li>Name it: <code className="text-violet-300">workclock</code> (or any name)</li>
                <li>Set visibility to <Badge color="bg-emerald-500/20 text-emerald-300" text="Public" /></li>
                <li>Click <strong className="text-white">Create Repository</strong></li>
              </ul>
            </Step>

            <Step num={3} title="Upload the index.html file">
              <p>In your new repo, click <strong className="text-white">uploading an existing file</strong> link, then:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
                <li>Drag & drop your <code className="text-violet-300">dist/index.html</code> file</li>
                <li>Click <strong className="text-white">Commit changes</strong></li>
              </ul>
            </Step>

            <Step num={4} title="Enable GitHub Pages">
              <p>In your repo, go to <strong className="text-white">Settings → Pages</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
                <li>Under <em>Source</em>, select <Badge color="bg-white/10 text-white/70" text="Deploy from a branch" /></li>
                <li>Branch: <code className="text-violet-300">main</code> → Folder: <code className="text-violet-300">/ (root)</code></li>
                <li>Click <strong className="text-white">Save</strong></li>
                <li>Wait ~2 minutes, your URL will be: <code className="text-emerald-300">https://YOUR-USERNAME.github.io/workclock/</code></li>
              </ul>
            </Step>

            <Step num={5} title="Embed in Blogger with an iframe">
              <p>In Blogger, go to <strong className="text-white">Layout → Add a Gadget → HTML/JavaScript</strong> and paste:</p>
              <CodeBlock code={iframeCode} label="Blogger HTML/JavaScript Widget" />
              <p className="mt-2 text-white/40">Replace <code className="text-violet-300">YOUR_GITHUB_PAGES_URL</code> with your actual GitHub Pages URL.</p>
            </Step>

            <Step num={6} title="(Optional) Make it a full dedicated page">
              <p>In Blogger, go to <strong className="text-white">Pages → New Page</strong>, switch to HTML view, and paste the same iframe code. Then in <strong className="text-white">Settings → Set as homepage</strong> to make it your main page.</p>
            </Step>

          </div>
        </div>
      )}

      {/* === NETLIFY METHOD === */}
      {activeMethod === 'netlify' && (
        <div className="glass rounded-2xl border border-white/08 overflow-hidden">
          <div className="px-5 py-4 bg-white/03 border-b border-white/08 flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <h3 className="text-white font-semibold font-display">Method 2: Netlify Drop</h3>
              <p className="text-xs text-white/40">Fastest method — deploy in under 1 minute</p>
            </div>
          </div>
          <div className="p-5 space-y-5">

            <Step num={1} title="Build & get your dist folder">
              <p>Run <code className="text-violet-300 bg-white/05 px-1 py-0.5 rounded">npm run build</code> in the project. You'll get a <code className="text-violet-300">dist/</code> folder containing <code className="text-violet-300">index.html</code>.</p>
            </Step>

            <Step num={2} title="Deploy to Netlify Drop">
              <p>Go to <a href="https://app.netlify.com/drop" target="_blank" className="text-teal-400 underline">app.netlify.com/drop</a></p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
                <li>Drag & drop your entire <code className="text-teal-300">dist/</code> folder onto the page</li>
                <li>Netlify instantly deploys it — no account needed!</li>
                <li>You get a URL like: <code className="text-emerald-300">https://random-name-123.netlify.app</code></li>
              </ul>
            </Step>

            <Step num={3} title="(Optional) Create a free Netlify account">
              <p>Sign up to get a permanent URL and custom subdomain like:</p>
              <p className="mt-1"><code className="text-emerald-300">https://workclock.netlify.app</code></p>
            </Step>

            <Step num={4} title="Embed in Blogger">
              <p>In Blogger → <strong className="text-white">Layout → Add a Gadget → HTML/JavaScript</strong>, paste:</p>
              <CodeBlock code={iframeCode} label="Blogger HTML/JavaScript Widget" />
              <p className="mt-2 text-white/40">Replace <code className="text-teal-300">YOUR_GITHUB_PAGES_URL</code> with your Netlify URL.</p>
            </Step>

          </div>
        </div>
      )}

      {/* === BLOGGER SETUP DETAILS === */}
      <div className="glass rounded-2xl border border-white/08 overflow-hidden">
        <div className="px-5 py-4 bg-white/03 border-b border-white/08 flex items-center gap-3">
          <span className="text-xl">🖊️</span>
          <h3 className="text-white font-semibold font-display">Blogger Setup: Step by Step</h3>
        </div>
        <div className="p-5 space-y-5">

          <Step num={1} title="Log into Blogger">
            <p>Go to <a href="https://blogger.com" target="_blank" className="text-violet-400 underline">blogger.com</a> and sign in with your Google account.</p>
          </Step>

          <Step num={2} title="Add as a Sidebar / Page Widget">
            <p>Navigate to <strong className="text-white">Layout → Add a Gadget</strong> (in the area you want) → Choose <strong className="text-white">HTML/JavaScript</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
              <li>Paste the iframe code</li>
              <li>Give it a title like "Work Hours Tracker"</li>
              <li>Click <strong className="text-white">Save</strong> → <strong className="text-white">Save Arrangement</strong></li>
            </ul>
          </Step>

          <Step num={3} title="Add as a Dedicated Full Page">
            <p>Go to <strong className="text-white">Pages → New Page</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
              <li>Title it: <strong className="text-white">Work Hours Tracker</strong></li>
              <li>Click the <Badge color="bg-white/10 text-white/70" text="HTML" /> view button (top left of editor)</li>
              <li>Paste the iframe code</li>
              <li>Click <strong className="text-white">Publish</strong></li>
            </ul>
          </Step>

          <Step num={4} title="Make it your homepage (optional)">
            <p>To make WorkClock your blog's landing page:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-white/50">
              <li>Go to <strong className="text-white">Settings → Search Preferences</strong></li>
              <li>Under <em>Custom Redirects</em>, click <strong className="text-white">Edit</strong></li>
              <li>From: <code className="text-violet-300">/</code> → To: <code className="text-violet-300">/p/work-hours-tracker.html</code></li>
              <li>Check <strong className="text-white">Permanent</strong> → Save</li>
            </ul>
          </Step>

        </div>
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl border border-white/08 p-5 space-y-3">
        <h3 className="text-white font-semibold font-display flex items-center gap-2">
          <span>💡</span> Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-white/50">
          <li className="flex gap-2">
            <span className="text-violet-400 flex-shrink-0">→</span>
            Set the iframe height to <code className="text-violet-300">850px</code> on desktop for the best experience
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400 flex-shrink-0">→</span>
            The app saves all data in your browser's <code className="text-violet-300">localStorage</code> — each visitor's data is private to their own device
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400 flex-shrink-0">→</span>
            Use a <Badge color="bg-blue-500/20 text-blue-300" text="Custom Domain" /> on Blogger + Netlify for a professional look (e.g., <code className="text-emerald-300">workclock.yoursite.com</code>)
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400 flex-shrink-0">→</span>
            GitHub Pages is recommended for long-term reliability. Netlify Drop links expire after a while without an account
          </li>
        </ul>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift glass rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:border-violet-500/40 transition-colors"
        >
          <span className="text-2xl">🐙</span>
          <div>
            <p className="text-sm font-semibold text-white">GitHub</p>
            <p className="text-xs text-white/30">Free hosting</p>
          </div>
        </a>
        <a
          href="https://app.netlify.com/drop"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift glass rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:border-teal-500/40 transition-colors"
        >
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-semibold text-white">Netlify Drop</p>
            <p className="text-xs text-white/30">Instant deploy</p>
          </div>
        </a>
        <a
          href="https://blogger.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift glass rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:border-orange-500/40 transition-colors"
        >
          <span className="text-2xl">📝</span>
          <div>
            <p className="text-sm font-semibold text-white">Blogger</p>
            <p className="text-xs text-white/30">Your blog</p>
          </div>
        </a>
        <a
          href="https://pages.github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift glass rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:border-violet-500/40 transition-colors"
        >
          <span className="text-2xl">📖</span>
          <div>
            <p className="text-sm font-semibold text-white">Pages Docs</p>
            <p className="text-xs text-white/30">GitHub guide</p>
          </div>
        </a>
      </div>

    </div>
  );
}
