import { render, screen } from "../../../test-utils/testing-library-utils";
import { element } from "prop-types";
import { OrderDetailsProvider } from "../../../context/OrderDetails";

import Options from "../Options";

test("display image for each scoop option from server", async () => {
  // render(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });
  // 글로벌 하게 wrapper를 설정해 줬으므로, 여기서는 wrapper를 따로 감싸주지 않아도 괜찮음.
  render(<Options optionType="scoops" />);

  // find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2); // handler에 2개를 썼으므로

  // confirm alt text of images
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("display image for each topping option from server", async () => {
  render(<Options optionType="toppings" />);

  const toppingImages = await screen.findAllByRole("img", {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);

  const altText = toppingImages.map((element) => element.alt);
  expect(altText).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot fudge topping",
  ]);
});
