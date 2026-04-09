document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("main-wrapper");
    const res = await fetch("../assets/media_log.json");
    const data = await res.json();

    data.sort((a, b) => {
        const months = [
            "january","february","march","april","may","june","july","august","september","october","november","december"
        ];
        return (
            months.indexOf(b.month) - months.indexOf(a.month) ||
            b.day - a.day
        );
    });

    const grouped = {};
    data.forEach(item => {
        if (!grouped[item.month]) {
            grouped[item.month] = [];
        }
        grouped[item.month].push(item);
    });

    const mediaEmojiMap = {
        book: "📖",
        film: "🎥",
        game: "🎮"
    };
    const existingMonths = [];

    Object.keys(grouped).forEach(month => {
        existingMonths.push(month);

        const h2 = document.createElement("h2");
        h2.id = month;
        h2.textContent = month;
        container.appendChild(h2);

        grouped[month].forEach(item => {
            const box = document.createElement("div");
            box.className = "main-box";
            const emoji = mediaEmojiMap[item.media_type.toLowerCase()] || "📦";
            const stars = "⭑".repeat(item.rating) + "⭐︎".repeat(5-item.rating);
            const title = item.title.toUpperCase();

            box.innerHTML = `
                <div class="media-info">
                    <p class="media-type">${emoji}</p>
                    <p class="media-meta">
                        ${title}
                        <br>${item.creator.toLowerCase()}
                        <br>${item.media_type} • <font style="color: olivedrab;">${item.genre}</font>
                    </p>
                    <p class="right">
                        ${stars}
                        <br>${month.slice(0,3).toUpperCase()} ${item.day}
                    </p>
                </div>
                <button>thoughts +</button>
                <div class="thoughts"></div>
            `;

            const thoughtsDiv = box.querySelector(".thoughts");

            thoughtsDiv.innerHTML = item.thoughts;
            thoughtsDiv.style.display = "none";

            const button = box.querySelector("button");
            button.addEventListener("click", () => {
                const open = thoughtsDiv.style.display === "block";
                thoughtsDiv.style.display = open ? "none" : "block";
                button.textContent = open ? "thoughts +" : "thoughts -";
            });
            container.appendChild(box);
        });
    });
    
    const nav = document.getElementById("nav");
    if (nav) {
        nav.innerHTML = existingMonths.map((month, i) => {
            const linkText = month.slice(0,3);
            return `<a href="#${month}">${linkText}</a>${i < existingMonths.length - 1 ? " ・ " : ""}`;
        }).join("");
    }
});