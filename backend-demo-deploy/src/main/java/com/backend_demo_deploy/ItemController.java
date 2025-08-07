package com.backend_demo_deploy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @PostMapping
    public Item createItem(@RequestBody Item item){
        return itemRepository.save(item);
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item updatedItem) {
        return itemRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName()); // only 'name' field to update
            return itemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public String deleteItem(@PathVariable Long id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return "Item deleted successfully.";
        } else {
            return "Item not found with id: " + id;
        }
    }
}
