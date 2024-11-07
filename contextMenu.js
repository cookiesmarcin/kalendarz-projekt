// contextMenu.js
export function initializeContextMenu() {
    const contextMenu = document.getElementById("context-menu");

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        if (e.target.classList.contains("time-slot") || e.target.classList.contains("delivery-block")) {
            document.querySelectorAll(".time-slot, .delivery-block").forEach(slot => slot.classList.remove("highlighted"));
            e.target.classList.add("highlighted");

            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.display = "block";

            contextMenu.targetSlot = e.target.classList.contains("time-slot") ? e.target : e.target.closest(".time-slot");
        } else {
            contextMenu.style.display = "none";
        }
    });

    document.addEventListener("click", function (e) {
        if (!e.target.classList.contains("context-menu") && !e.target.closest(".context-menu")) {
            contextMenu.style.display = "none";
        }
    });
}
