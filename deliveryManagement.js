// deliveryManagement.js
export function addDeliveryBlock(slot, name = "DOSTAWA CHEMII - ABC") {
    if (slot.querySelector(".delivery-block")) {
        alert("Slot już zawiera blok dostawy.");
        return;
    }

    const deliveryBlock = document.createElement("div");
    deliveryBlock.classList.add("delivery-block");
    deliveryBlock.innerText = name;
    deliveryBlock.style.gridRow = `span 3`;

    deliveryBlock.draggable = true;
    deliveryBlock.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", null);
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        deliveryBlock.classList.add("dragging");
    });

    deliveryBlock.addEventListener("dragend", () => {
        deliveryBlock.classList.remove("dragging");
    });

    slot.appendChild(deliveryBlock);
}

export function removeDeliveryBlock(contextMenu) {
    const targetBlock = contextMenu.targetSlot;
    if (targetBlock && targetBlock.classList.contains("delivery-block")) {
        targetBlock.remove();
    } else {
        console.log("Nie znaleziono bloku dostawy do usunięcia.");
    }
}
