import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";

test("Initial conditions", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  expect(confirmButton).toBeDisabled();
});

test("체크박스가 체크되면 버튼 활성화, 체크 안되면 버튼 비활성화", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });

  userEvent.click(checkbox);
  expect(confirmButton).toBeEnabled();

  userEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover responds to hover", async () => {
  render(<SummaryForm />);

  // popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  // 현재 화면에 없는 요소 이기 때문에 queryBy를 사용
  // expect(nullPopover).toBeNull(); 을 쓰려고 했지만, 왜냐면 queryBy로 찾았을 때 매칭되는 것이 없으면 null을 리턴하기 때문
  expect(nullPopover).not.toBeInTheDocument(); // 가 추천되어 짐.

  // popover appears upon mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  userEvent.hover(termsAndConditions);

  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();
  // getBy는 지정된 텍스트를 찾지못하면 error를 리턴함으로 굳이 toBeIntheDocument 메소드를 쓰지 않아도 테스트가 가능하지만,
  // 가독성면을 생각했을 때 expect(popover).toBeInTheDocument();를 써주는 것이 좋다.

  // popover disappears when we mouse out
  userEvent.unhover(termsAndConditions);
  // const nullPopoverAgain = screen.queryByText(/no ice cream will actually be delivered/i);
  // expect(nullPopoverAgain).not.toBeInTheDocument();
  
  // 위와 같은 방법으로 테스트 하려고 했지만, error(not wrapped in act (…) warning)가 나타남, 왜나면 테스트가 끝난 후에 react가 element를 update하기 때문 
  // 따라서 화면에 문구가 사라지길 기다린 다음 (async) 테스트 해야 함. 
  // 그 방법이 아래와 같음

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/no ice cream will actually be delivered/i)
  );
});
