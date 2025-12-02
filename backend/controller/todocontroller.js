import Todo from "../model/todo.js";

// Create new todo
export const createTodo = async (req, res) => {
  try {
    const { task, completed, createdAt } = req.body;

    // Associate todo with logged-in user
    const todo = new Todo({
      task,
      completed,
      createdAt,
      user: req.userId,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Create todo error:", err);
    res.status(500).json({ message: "Failed to create todo" });
  }
};

// Get todos for the logged-in user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.status(200).json(todos);
  } catch (err) {
    console.error("Get todos error:", err);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

// Update todo (only owner can update)
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    console.error("Update todo error:", err);
    res.status(500).json({ message: "Failed to update todo" });
  }
};

// Delete todo (only owner can delete)
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
