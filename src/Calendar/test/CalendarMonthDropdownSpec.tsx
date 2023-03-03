import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import sinon from 'sinon';
import MonthDropdown from '../MonthDropdown';
import CalendarContext from '../CalendarContext';

describe('Calendar-MonthDropdown', () => {
  it('Should output year and month ', () => {
    render(
      <CalendarContext.Provider
        value={{
          date: new Date(),
          locale: {},
          isoWeek: false
        }}
      >
        <MonthDropdown show />
      </CalendarContext.Provider>
    );

    expect(screen.getAllByRole('rowheader', { hidden: true })).to.be.lengthOf(7);
    expect(screen.getAllByRole('gridcell', { hidden: true })).to.be.lengthOf(7);
    expect(screen.getAllByRole('gridcell', { hidden: true })[0].childNodes).to.be.lengthOf(12);
  });

  it('Should call `onChangeMonth` callback ', () => {
    const onChangeMonthSpy = sinon.spy();
    render(
      <CalendarContext.Provider
        value={{
          onChangeMonth: onChangeMonthSpy,
          date: new Date(),
          locale: {},
          isoWeek: false
        }}
      >
        <MonthDropdown show />
      </CalendarContext.Provider>
    );

    fireEvent.click(
      screen
        .getByRole('menu', { hidden: true })
        .querySelector('.rs-calendar-month-dropdown-cell') as HTMLElement
    );

    expect(onChangeMonthSpy).to.be.calledOnce;
  });

  it('Should disable month', () => {
    render(
      <CalendarContext.Provider value={{ date: new Date(2019, 8, 1), locale: {}, isoWeek: false }}>
        <MonthDropdown
          show
          disabledMonth={d => {
            const today = new Date(2019, 8, 6);
            const d2 = new Date(today.getTime() - 240 * 60 * 60 * 1000);
            return d.getTime() > today.getTime() || d.getTime() < d2.getTime();
          }}
        />
      </CalendarContext.Provider>
    );

    const cells = (
      (
        screen
          .getByRole('menu', { hidden: true })
          .querySelector('.rs-calendar-month-dropdown-year-active') as HTMLElement
      ).parentNode as HTMLElement
    ).querySelectorAll('.rs-calendar-month-dropdown-cell');

    expect(cells[6]).to.have.class('disabled');
    expect(cells[7]).to.have.class('rs-calendar-month-dropdown-cell');
    expect(cells[8]).to.have.class('rs-calendar-month-dropdown-cell-active');
    expect(cells[9]).to.have.class('disabled');
  });

  it('Should have a custom className', () => {
    render(<MonthDropdown className="custom" />);
    expect(screen.getByRole('menu', { hidden: true })).to.have.class('custom');
  });

  it('Should have a custom style', () => {
    render(<MonthDropdown style={{ fontSize: 12 }} />);

    expect(screen.getByRole('menu', { hidden: true })).to.have.style('font-size', '12px');
  });

  it('Should have a custom className prefix', () => {
    render(<MonthDropdown classPrefix="custom-prefix" />);
    expect(screen.getByRole('menu', { hidden: true })).to.have.class('rs-custom-prefix');
  });
});
