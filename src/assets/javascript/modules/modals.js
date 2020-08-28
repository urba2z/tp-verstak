export default function modalsConfig() {
  const $ = {}

  Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling)
  }

  function noop() {}

  function _createFooter(buttons = []) {
    if (buttons.length === 0) {
      return document.createElement('div')
    }
    const wrappper = document.createElement('div')
    wrappper.classList.add('modal-window__footer')

    buttons.forEach(btn => {
      const $btn = document.createElement('button')
      $btn.textContent = btn.name;
      $btn.classList.add('modal-button')
      $btn.classList.add('modal__button')
      $btn.onclick = btn.handler || noop

      wrappper.appendChild($btn)
    })
    return wrappper
  }


  function _createModal(options) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.insertAdjacentHTML('afterbegin', `
            <div class = "modal-overlay"${options.closable ?'data-close="true"':''}>
              <div class="modal-window">
                <div class="modal-window__header">
                  <span class="modal-window__title">${options.title || ''}</span> 
                  ${options.closable ? `<span class="modal-close" data-close="true" >&times;</span>` : ''}
                </div> 
                <div class = "modal-window__body" data-content>${options.content || ''}</div> 
              </div> 
            </div> 
      `)
    const footer = _createFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
  }

  $.modal = function (options) {
    const $modal = _createModal(options);
    let closing = false;
    let destroyed = false;

    const methods = {
      open() {
        if (destroyed) {
          return console.log("Окно было уничтожено")
        }!closing && $modal.classList.add('active');
        !closing && document.body.classList.add('hidden');
      },
      close() {
        closing = true
        $modal.classList.remove('active');
        document.body.classList.remove('hidden');
        $modal.classList.add('hide');
        setTimeout(() => {
          $modal.classList.remove('hide');
        }, 400);
        closing = false

      },
    }

    const mouseListener = event => {
      if (event.target.dataset.close) {
        methods.close()
      }
    }

    const keyListener = event => {
      if (event.code == 'Escape') {
        methods.close()
      }
    }

    if (options.closable == true) {
      $modal.addEventListener('click', mouseListener)
      document.addEventListener('keydown', keyListener)
    }
    return Object.assign(methods, {
      destroy() {
        $modal.parentNode.removeChild($modal);
        destroyed = true;
        $modal.removeEventListener('click', mouseListener)
        document.removeEventListener('keydown', keyListener)
      },
      setContent(html) {
        $modal.querySelector('[data-contnt]').innerHTML = html
      }
    })

  }

  /* Пример правилной настройки окна

  const myModal = $.modal({
    title: "Тестовый заголовок",
    content: "Тестовый контен",
    closable: true,
    footerButtons: [{
        name: 'OK',
        handler() {
          // Событие при клике
        }
      },
      {
        name: 'Cancel',
        handler() {
          // Событие при клике
        }
      }
    ]
  })
  */
}