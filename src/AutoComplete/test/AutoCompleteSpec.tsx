import React from 'react';
import AutoComplete from '../AutoComplete';
import { getInstance } from '@test/testUtils';
import { testStandardProps } from '@test/commonCases';
import { render, fireEvent, screen } from '@testing-library/react';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';

const data = ['item1', 'item2'];

describe('AutoComplete', () => {
  testStandardProps(<AutoComplete data={data} />);

  it('Should render input', () => {
    render(<AutoComplete data={data} />);

    expect(document.querySelector('input')).to.exist;
  });

  it('Should render 2 `option` when set `open` and `defaultValue`', () => {
    const instance = getInstance(<AutoComplete data={['a', 'b', 'ab']} open defaultValue="a" />);
    expect(instance.overlay.querySelectorAll('[role="option"]')).to.length(2);
  });

  it('Should be a `top-end` for placement', () => {
    const instance = getInstance(<AutoComplete data={data} open placement="topEnd" />);
    expect(instance.overlay.className).to.contain('placement-top-end');
  });

  it('Should be disabled', () => {
    render(<AutoComplete data={data} disabled data-testid="autocomplete" />);
    expect(screen.getByTestId('autocomplete')).to.have.class('rs-auto-complete-disabled');
  });

  it('Should call onSelect callback with correct args', () => {
    const onSelectSpy = sinon.spy();
    const instance = getInstance(
      <AutoComplete data={['a', 'b', 'ab']} open defaultValue="a" onSelect={onSelectSpy} />
    );
    fireEvent.click(instance.overlay.querySelectorAll('.rs-auto-complete-item')[0]);

    expect(onSelectSpy).to.be.calledOnce;
    expect(onSelectSpy).to.be.calledWith('a', { value: 'a', label: 'a' });
  });

  it('Should call onChange callback', () => {
    const onChangeSpy = sinon.spy();

    render(<AutoComplete data={data} onChange={onChangeSpy} />);

    userEvent.type(screen.getByRole('textbox'), 'a');

    expect(onChangeSpy).to.have.been.calledOnce;
    expect(onChangeSpy).to.have.been.calledWith('a');
  });

  it('Should call onFocus callback', () => {
    const onFocusSpy = sinon.spy();
    render(<AutoComplete data={data} onFocus={onFocusSpy} />);
    const input = document.querySelector('input') as HTMLInputElement;
    fireEvent.focus(input);
    expect(onFocusSpy).to.have.been.calledOnce;
  });

  it('Should call onBlur callback', () => {
    const onBlurSpy = sinon.spy();

    render(<AutoComplete data={data} onBlur={onBlurSpy} />);
    const input = document.querySelector('input') as HTMLInputElement;
    fireEvent.blur(input);
    expect(onBlurSpy).to.have.been.calledOnce;
  });

  it('Should call onKeyDown callback on input', () => {
    const onKeyDownSpy = sinon.spy();

    render(<AutoComplete onKeyDown={onKeyDownSpy} data={['a', 'b', 'ab']} open />);
    const input = document.querySelector('input') as HTMLInputElement;
    fireEvent.keyDown(input);
    expect(onKeyDownSpy).to.have.been.calledOnce;
  });

  it('Should call onKeyDown callback on menu', () => {
    const onKeyDownSpy = sinon.spy();
    const instance = getInstance(
      <AutoComplete defaultValue="a" onKeyDown={onKeyDownSpy} data={['a', 'b']} open />
    );
    fireEvent.keyDown(instance.overlay);

    expect(onKeyDownSpy).to.be.calledOnce;
  });

  it('Should call onMenuFocus callback when key=ArrowDown', () => {
    const onMenuFocusSpy = sinon.spy();

    const instance = getInstance(
      <AutoComplete defaultValue="a" onMenuFocus={onMenuFocusSpy} data={['a', 'ab', 'ac']} open />
    );
    fireEvent.keyDown(instance.overlay, {
      key: 'ArrowDown'
    });

    expect(onMenuFocusSpy).to.be.calledOnce;
  });

  it('Should call onMenuFocus callback when key=ArrowUp', () => {
    const onMenuFocusSpy = sinon.spy();
    const instance = getInstance(
      <AutoComplete defaultValue="a" onMenuFocus={onMenuFocusSpy} data={['a', 'ab', 'ac']} open />
    );
    fireEvent.keyDown(instance.overlay, { key: 'ArrowDown' });
    fireEvent.keyDown(instance.overlay, { key: 'ArrowUp' });

    expect(onMenuFocusSpy).to.be.calledTwice;
  });

  it('Should call onChange callback when key=Enter', () => {
    const onChangeSpy = sinon.spy();
    const instance = getInstance(
      <AutoComplete defaultValue="a" onChange={onChangeSpy} data={['a', 'ab', 'ac']} open />
    );

    fireEvent.keyDown(instance.overlay, { key: 'ArrowDown' });
    fireEvent.keyDown(instance.overlay, { key: 'Enter' });
    expect(onChangeSpy).to.be.calledOnce;
  });

  it('Should call onSelect callback with selected item when key=Enter', () => {
    const onSelectSpy = sinon.spy();

    const instance = getInstance(
      <AutoComplete defaultValue="a" onSelect={onSelectSpy} data={['a', 'ab', 'ac']} open />
    );
    fireEvent.keyDown(instance.overlay, { key: 'ArrowDown' });
    fireEvent.keyDown(instance.overlay, { key: 'Enter' });

    expect(onSelectSpy).to.be.calledOnce;
    expect(onSelectSpy).to.be.calledWith('ab', { value: 'ab', label: 'ab' });
  });

  it('Shouldn‘t call onSelect nor onChange callback on Enter pressed if selectOnEnter=false', () => {
    const onSelectSpy = sinon.spy();

    const instance = getInstance(
      <AutoComplete
        defaultValue="a"
        onSelect={onSelectSpy}
        onChange={onSelectSpy}
        selectOnEnter={false}
        data={['a', 'ab', 'ac']}
        open
      />
    );
    fireEvent.keyDown(instance.overlay, { key: 'ArrowDown' });
    fireEvent.keyDown(instance.overlay, { key: 'ArrowUp' });

    expect(onSelectSpy).to.be.not.called;
  });

  it('Should call onClose callback when key=Escape', () => {
    const onCloseSpy = sinon.spy();
    const instance = getInstance(
      <AutoComplete defaultValue="a" onClose={onCloseSpy} data={['a', 'ab', 'ac']} open />
    );
    fireEvent.keyDown(instance.overlay, { key: 'Escape' });
    expect(onCloseSpy).to.be.calledOnce;
  });

  it('Should render a icon in li', () => {
    const instance = getInstance(
      <AutoComplete
        data={['a', 'b', 'ab']}
        open
        defaultValue="a"
        renderMenuItem={() => <i className="icon" />}
      />
    );

    expect(instance.overlay.querySelectorAll('.rs-auto-complete-item .icon')).to.length(2);
  });

  it('Should have a menuClassName', () => {
    const instance = getInstance(
      <AutoComplete menuClassName="custom" data={['a', 'b', 'ab']} open />
    );

    expect(instance.overlay.querySelector('[role="listbox"]').className).to.include('custom');
  });

  it('Should have a custom filter function', () => {
    const instance1 = getInstance(
      <AutoComplete data={['a', 'b', 'ab']} open defaultValue="a" filterBy={() => true} />
    );

    expect(instance1.overlay.querySelectorAll('[role="option"]')).to.length(3);

    const instance2 = getInstance(
      <AutoComplete data={['a', 'b', 'ab']} open defaultValue="a" filterBy={() => false} />
    );

    expect(instance2.overlay.querySelectorAll('[role="option"]')).to.length(0);

    const instance3 = getInstance(
      <AutoComplete
        data={['a', 'b', 'ab']}
        open
        defaultValue="a"
        // filterBy value only, so all item will be displayed
        filterBy={value => value === 'a'}
      />
    );

    expect(instance3.overlay.querySelectorAll('[role="option"]')).to.length(3);

    const instance4 = getInstance(
      <AutoComplete
        data={['a', 'b', 'ab']}
        open
        defaultValue="a"
        filterBy={(_, item) => Boolean(item.label) && (item.label as string).length >= 2}
      />
    );

    expect(instance4.overlay.querySelectorAll('[role="option"]')).to.length(1);
  });

  it('Should set minimum width for listbox', () => {
    const { getByRole } = render(
      <AutoComplete
        data={['item1', 'item2', 'item3']}
        defaultValue="item"
        open
        menuAutoWidth
        style={{ width: 100 }}
      />
    );

    const listbox = getByRole('listbox');

    expect((listbox.parentNode as HTMLElement).style.minWidth).to.equal('100px');
  });

  it('Should not throw an error', () => {
    const callback = sinon.spy();
    expect(() => {
      render(
        <AutoComplete data={data} onExit={callback} onExiting={callback} onEnter={callback} />
      );
    }).to.not.throw();
  });

  it('Should only receive input attributes on `<input>`', () => {
    const { getByTestId } = render(
      <AutoComplete data={data} data-id={1} name="username" data-testid="test" />
    );

    expect(getByTestId('test')).to.have.attribute('data-id', '1');
    expect(getByTestId('test').querySelector('input')).to.have.attribute('name', 'username');
  });

  it('Should apply size class', () => {
    const { getByTestId } = render(<AutoComplete size="lg" data={[]} data-testid="test" />);
    expect(getByTestId('test').querySelector('input')).to.have.class('rs-input-lg');
  });
});
