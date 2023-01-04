const URL = 'https://bakesaleforgood.com/api/deals';

export const fetchData = async () => {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchDetails = async dealId => {
  try {
    let res = await fetch(`${URL}/${dealId}`);
    let deals = await res.json();
    return deals;
  } catch (err) {
    console.log(err);
  }
};

export const searchDeals = async searchValue => {
  try {
    let res = await fetch(`${URL}?searchTerm=${searchValue}`);
    let deals = await res.json();
    return deals;
  } catch (err) {
    console.log(err);
  }
};
