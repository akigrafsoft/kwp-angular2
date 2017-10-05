import { KwpAngular2Page } from './app.po';

describe('kwp-angular App', function() {
  let page: KwpAngular2Page;

  beforeEach(() => {
    page = new KwpAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
