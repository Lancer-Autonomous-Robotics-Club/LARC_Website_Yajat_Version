// LARC v2 — professional theme. Nav, reveal, tabs, form. No anime effects.
(function () {
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();

  var header = document.getElementById('site-header');
  var btn = document.getElementById('menu-btn');
  var links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  // Subtle reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal, .card, .member, .tier').forEach(function (el) {
      el.classList.add('reveal'); io.observe(el);
    });
  }

  // Tabs (simulation section)
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      document.querySelectorAll('.tab-p').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var p = document.getElementById(t.dataset.tab);
      if (p) p.classList.add('active');
    });
  });

  // Resume dropzone: validation, file chip, drag glow, remove
  // (front-end only — connect to Formspree / backend for file storage)
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  var resume = document.getElementById('resume');
  var dz = document.getElementById('dz');
  var chip = document.getElementById('chip');
  var chipName = document.getElementById('chip-name');
  var chipRemove = document.getElementById('chip-remove');
  var MAX_MB = 5;
  var ALLOWED = ['pdf', 'doc', 'docx'];
  function fmtKB(n) { return n < 1024 ? n + ' B' : Math.round(n / 1024) + ' KB'; }
  function setNote(msg, ok) {
    if (!note) return;
    note.style.color = ok ? '#0a6b2a' : '#a40000';
    note.textContent = msg;
  }
  function clearFile() {
    if (resume) resume.value = '';
    if (chip) chip.classList.remove('show');
    if (chipName) chipName.textContent = '';
  }
  function handleFile(f) {
    if (!f) return;
    var ext = (f.name.split('.').pop() || '').toLowerCase();
    if (ALLOWED.indexOf(ext) < 0) { setNote('Please upload a PDF, DOC or DOCX resume.', false); clearFile(); return; }
    if (f.size > MAX_MB * 1024 * 1024) { setNote('Resume is over ' + MAX_MB + ' MB — please compress it and retry.', false); clearFile(); return; }
    if (chipName) chipName.textContent = f.name + ' (' + fmtKB(f.size) + ')';
    if (chip) chip.classList.add('show');
    setNote('', true);
  }
  if (resume) resume.addEventListener('change', function () { handleFile(resume.files[0]); });
  if (chipRemove) chipRemove.addEventListener('click', function () { clearFile(); setNote('', true); });
  if (dz) {
    ['dragenter', 'dragover'].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('dragover'); });
    });
    dz.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && resume) { e.preventDefault(); resume.click(); }
    });
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        if (note) { note.style.color = '#a40000'; note.textContent = 'Please complete name, valid email, and message.'; }
        return;
      }
      var data = Object.fromEntries(new FormData(form).entries());
      var first = String(data.name).split(' ')[0];
      var hasResume = resume && resume.files && resume.files.length > 0;
      var extra = hasResume ? ' Resume received: ' + resume.files[0].name + '.' : ' No resume attached — you can add one later.';
      setNote('Thank you, ' + first + '. Received — we will reply at ' + data.email + '.' + extra, true);
      form.reset();
      clearFile();
    });
  }
})();
