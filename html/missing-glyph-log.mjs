function createMissingGlyphReporter(fontVersion){
    const storageKey = `eva-title:reported-glyphs:${fontVersion}`;
    const confirmed = new Set();
    let queue = Promise.resolve();

    return characters => {
        if(!fontVersion || !characters.length) return;
        const points = [...new Set(characters.map(character => character.codePointAt(0)))]
            .filter(point => point < 0xd800 || point > 0xdfff);
        const send = async () => {
            try {
                const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
                if(Array.isArray(saved)){
                    for(const point of saved) confirmed.add(point);
                }
            } catch {}

            const codepoints = points.filter(point => !confirmed.has(point));
            if(!codepoints.length) return;
            const response = await fetch('/api/log/font-missing',{
                method:'POST',
                credentials:'omit',
                referrerPolicy:'no-referrer',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({fontVersion,codepoints}),
            });
            if(response.status !== 204) return;

            for(const point of codepoints) confirmed.add(point);
            try {
                localStorage.setItem(storageKey,JSON.stringify([...confirmed]));
            } catch {}
        };
        queue = queue.then(() => navigator.locks
            ? navigator.locks.request(storageKey,send)
            : send()).catch(() => {});
    };
}

export { createMissingGlyphReporter };
