interface ContentProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    deadline: string;
    setDeadline: (value: string) => void;
}

export function Content({ title, setTitle, description, setDescription, deadline, setDeadline }: ContentProps) {
    return(
        <>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Основное</p>
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Название формы</label>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Новая форма"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Описание</label>
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Коротко о форме..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors resize-none"/>
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="deadline-input" className="text-sm text-gray-600">Дедлайн (необязательно)</label>
            <input
                id="deadline-input"
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
        </div>
        </>
    );
}