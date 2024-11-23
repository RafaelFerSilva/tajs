import { describe, it, jest, expect, beforeEach } from '@jest/globals';
import View from '../../public/src/view.js';

describe('View test suite', () => {
  let view; // Instância da classe View
  let formMock, cardListMock, titleMock; // Mocks para elementos DOM

  beforeEach(() => {
    // Mock de formulário com métodos necessários
    formMock = {
      addEventListener: jest.fn(),
      classList: { add: jest.fn(), remove: jest.fn() },
      checkValidity: jest.fn(),
      reset: jest.fn(),
      elements: [
        { checkValidity: jest.fn(() => true), focus: jest.fn() },
      ],
    };

    // Mock de card list
    cardListMock = { innerHTML: '' };

    // Mock de título
    titleMock = { focus: jest.fn() };

    // Mock de querySelectorAll e querySelector
    jest.spyOn(document, 'querySelectorAll').mockReturnValue([formMock]);
    jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === '#card-list') return cardListMock;
      if (selector === '#title') return titleMock;
      return null;
    });

    // Instancia a classe View
    view = new View();
  });

  it('#initialize should register submit event listeners on forms', () => {
    view.initialize();

    // Verifica se o evento 'submit' foi registrado no formulário
    expect(formMock.addEventListener).toHaveBeenCalledTimes(1);
    expect(formMock.addEventListener).toHaveBeenCalledWith(
      'submit',
      expect.any(Function),
      false
    );
  });

  it('#configureOnSubmit should set a custom submit function', () => {
    const mockSubmitFn = jest.fn(); // Mock para função personalizada de submissão
    view.configureOnSubmit(mockSubmitFn);

    // Configura o formulário como válido e adiciona dados simulados
    formMock.checkValidity.mockReturnValue(true);
    formMock.title = { value: 'Sample Title' };
    formMock.imageUrl = { value: 'http://example.com/image.png' };

    // Inicializa e simula a submissão do formulário
    view.initialize();
    const submitHandler = formMock.addEventListener.mock.calls[0][1];
    const eventMock = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

    submitHandler(eventMock);

    // Verifica comportamento esperado
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(eventMock.stopPropagation).toHaveBeenCalled();
    expect(mockSubmitFn).toHaveBeenCalledWith({
      title: 'Sample Title',
      imageUrl: 'http://example.com/image.png',
    });
  });

  it('#updateList should append content to card-list innerHTML', () => {
    const data = [
      { title: 'Test Title', imageUrl: 'http://example.com/image.png' },
    ];

    // Atualiza a lista de cards
    view.updateList(data);

    // Gera conteúdo esperado
    const expectedContent = `
        <article class="col-md-12 col-lg-4 col-sm-3 top-30">
                <div class="card">
                    <figure>
                        <img class="card-img-top card-img"
                            src="http://example.com/image.png"
                            alt="Image of an Test Title">
                        <figcaption>
                            <h4 class="card-title">Test Title</h4>
                        </figcaption>
                    </figure>
                </div>
            </article>
        `;

    // Verifica se o conteúdo foi adicionado corretamente
    expect(cardListMock.innerHTML).toContain(expectedContent.trim());
  });

  it('#initialize should handle invalid forms and focus on the first invalid field', () => {
    const invalidField = {
      checkValidity: jest.fn(() => false),
      focus: jest.fn(),
    };

    // Configura o formulário como inválido
    formMock.checkValidity.mockReturnValue(false);
    formMock.elements = [invalidField];

    // Inicializa e simula submissão
    view.initialize();
    const submitHandler = formMock.addEventListener.mock.calls[0][1];
    const eventMock = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

    submitHandler(eventMock);

    // Verifica comportamento esperado
    expect(invalidField.focus).toHaveBeenCalled();
    expect(formMock.classList.add).toHaveBeenCalledWith('was-validated');
    expect(formMock.reset).not.toHaveBeenCalled();
  });
});
