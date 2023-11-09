export function getIcon() {
  fetch("src/conditions.json")
    .then((r) => r.json())
    .then(
      (conditions) =>
        (container.src = `./images/icons/${
          conditions[currentForecast.condition.code].icon
        }.svg`),
    );
}
