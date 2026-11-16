const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3333;

// Infraestrutura já fornecida: JSON e acesso do frontend em outro domínio.
// CORS aberto somente para esta API didática pública, sem autenticação.
app.use(cors());
app.use(express.json());

const tickets = [];
let nextId = 1;

const priorities = ['baixa', 'media', 'alta'];

// Complete as seis rotas. O 501 identifica uma rota ainda não implementada.
// Substitua cada resposta 501 por sua lógica e pelas respostas do contrato.

app.get('/api/summary', (request, response) => {
    const summary = {
        total: tickets.length,
        aberto: 0,
        em_atendimento: 0,
        resolvido: 0
    };

    tickets.forEach(ticket => {
        summary[ticket.status] += 1;
    });

    return response.status(200).json(summary);
});

app.get('/api/tickets', (request, response) => {
    const { search, status, category, priority, sort } = request.query;

    const term = typeof search === 'string' ? search.trim().toLowerCase() : '';
    const result = tickets.filter(ticket => {
        const matchesSearch = !term
            || ticket.title.toLowerCase().includes(term)
            || ticket.requester.toLowerCase().includes(term);

        return matchesSearch
            && (!status || ticket.status === status)
            && (!category || ticket.category === category)
            && (!priority || ticket.priority === priority);
    });

    if (sort === 'priority') {
        result.sort((first, second) => {
            return priorities.indexOf(second.priority)
                - priorities.indexOf(first.priority);
        });
    } else {
        result.sort((first, second) => {
            return new Date(second.createdAt) - new Date(first.createdAt);
        });
    }

    return response.status(200).json(result);
});

app.get('/api/tickets/:id', (request, response) => {
    const { id } = request.params;
    const ticket = tickets.find(item => item.id === Number(id));

    if (!ticket) {
        return response.status(404).json({ message: 'Chamado não encontrado.' });
    }

    return response.status(200).json(ticket);
});

app.post('/api/tickets', (request, response) => {
    const { title, description, requester, category, priority } = request.body ?? {};
    const ticket = {
        id: nextId++,
        title,
        description,
        requester,
        category,
        priority,
        status: 'aberto',
        createdAt: new Date().toISOString()
    };
    tickets.push(ticket);
    return response.status(201).json(ticket);
});

app.put('/api/tickets/:id', (request, response) => {
    const { id } = request.params;
    const { title, description, requester, category, priority, status } = request.body ?? {};
    const index = tickets.findIndex(item => item.id === Number(id));

    if (index === -1) {
        return response.status(404).json({ message: 'Chamado não encontrado.' });
    }

    const current = tickets[index];
    tickets[index] = {
        id: current.id,
        title,
        description,
        requester,
        category,
        priority,
        status,
        createdAt: current.createdAt
    };
    return response.status(200).json(tickets[index]);
});

app.delete('/api/tickets/:id', (request, response) => {
    const { id } = request.params;
    const index = tickets.findIndex(item => item.id === Number(id));

    if (index === -1) {
        return response.status(404).json({ message: 'Chamado não encontrado.' });
    }

    if (tickets[index].status !== 'resolvido') {
        return response.status(400).json({
            message: 'Somente chamados resolvidos podem ser excluídos.'
        });
    }

    tickets.splice(index, 1);
    return response.status(200).json({ message: 'Chamado excluído com sucesso.' });
});

app.listen(port, () => {
    console.log(`API disponível na porta ${port}`);
});
