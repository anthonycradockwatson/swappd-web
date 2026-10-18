// Contact form: builds a pre-filled email to the support address (no backend needed).
(() => {
  const SUPPORT_EMAIL = 'alex@swappd.app';
  const form = document.getElementById('support-form');
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const submitBtn = $('support-submit');
  const submitLabelDefault = submitBtn.textContent;
  const topicSelect = $('topic');
  const partTypeSelect = $('part-type');
  const partsRequestFields = $('parts-request-fields');
  const wheelDetails = $('wheel-details');
  const messageField = $('message-field');
  const messageInput = $('message');
  const manufacturerInput = $('manufacturer');
  const partModelInput = $('part-model');
  const wheelColourInput = $('wheel-colour');
  const wheelSizeInput = $('wheel-size');
  let resetTimer = null;

  function updateWheelDetailsVisibility() {
    const isWheel = partTypeSelect.value === 'Wheels';
    wheelDetails.classList.toggle('is-visible', isWheel);
    if (!isWheel) {
      wheelColourInput.value = '';
      wheelSizeInput.value = '';
    }
  }

  function updatePartsRequestVisibility() {
    const isParts = topicSelect.value === 'Parts Request';
    partsRequestFields.classList.toggle('is-visible', isParts);
    messageField.style.display = isParts ? 'none' : 'block';

    partTypeSelect.required = isParts;
    manufacturerInput.required = isParts;
    partModelInput.required = isParts;
    messageInput.required = !isParts;

    if (isParts) {
      messageInput.value = '';
    } else {
      partTypeSelect.value = '';
      manufacturerInput.value = '';
      partModelInput.value = '';
      wheelColourInput.value = '';
      wheelSizeInput.value = '';
      wheelDetails.classList.remove('is-visible');
    }
  }

  topicSelect.addEventListener('change', updatePartsRequestVisibility);
  partTypeSelect.addEventListener('change', updateWheelDetailsVisibility);

  // ?topic=partnership preselects the partnership topic (used by the Partnerships page)
  if (new URLSearchParams(location.search).get('topic') === 'partnership') {
    topicSelect.value = 'Partnership';
  }
  updatePartsRequestVisibility();
  updateWheelDetailsVisibility();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    clearTimeout(resetTimer);

    const name = $('name').value.trim();
    const email = $('email').value.trim();
    const topic = topicSelect.value;
    const message = messageInput.value.trim();
    const partType = partTypeSelect.value;
    const manufacturer = manufacturerInput.value.trim();
    const partModel = partModelInput.value.trim();
    const wheelColour = wheelColourInput.value.trim();
    const wheelSize = wheelSizeInput.value.trim();
    const isParts = topic === 'Parts Request';
    const isWheel = partType === 'Wheels';

    const subject = `[${topic}] Swappd support \u2014 ${name}`;
    const body =
      `Topic: ${topic}\r\n\r\n` +
      `Name: ${name}\r\n` +
      `Email: ${email}\r\n\r\n` +
      (isParts
        ? 'Parts request details:\r\n' +
          `Part type: ${partType}\r\n` +
          `Manufacturer: ${manufacturer}\r\n` +
          `Model: ${partModel}\r\n` +
          (isWheel && wheelColour ? `Wheel colour: ${wheelColour}\r\n` : '') +
          (isWheel && wheelSize ? `Wheel size: ${wheelSize}\r\n` : '') +
          '\r\n'
        : `Message:\r\n${message}`);

    window.location.href =
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    form.reset();
    updatePartsRequestVisibility();
    updateWheelDetailsVisibility();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Opening your mail app\u2026';
    resetTimer = setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabelDefault;
    }, 2600);
  });
})();
