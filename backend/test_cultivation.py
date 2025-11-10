"""
Test cultivation level system to ensure:
1. Manual slider can set level up or down
2. Meditation button only increases cultivation
3. Automatic meditation doesn't increase cultivation (no feedback loop)
4. ONE counter is used consistently
"""

from bayesian_model import BayesianBeliefModel
import time


def test_manual_slider():
    """Test that manual slider can set cultivation to any value"""
    print("\n=== Test 1: Manual Slider ===")
    model = BayesianBeliefModel()
    
    # Start at 0%
    assert model.brahma_viharas_level == 0.0, "Should start at 0%"
    print("✓ Initial level: 0%")
    
    # Set to 50%
    model.set_brahma_viharas_level(0.5)
    assert model.brahma_viharas_level == 0.5, "Should be 50%"
    print("✓ Set to 50%")
    
    # Set to 100%
    model.set_brahma_viharas_level(1.0)
    assert model.brahma_viharas_level == 1.0, "Should be 100%"
    print("✓ Set to 100%")
    
    # Set back down to 30%
    model.set_brahma_viharas_level(0.3)
    assert model.brahma_viharas_level == 0.3, "Should be 30%"
    print("✓ Set back down to 30%")
    
    print("✅ Manual slider test passed!")


def test_meditation_button_increases_cultivation():
    """Test that meditation button only increases cultivation"""
    print("\n=== Test 2: Meditation Button Increases Cultivation ===")
    model = BayesianBeliefModel()
    
    # Set manual cultivation to 20%
    model.set_brahma_viharas_level(0.2)
    print(f"Initial cultivation (manual): {model.brahma_viharas_level * 100:.1f}%")
    
    # Add experiences that will be squeezed
    model.add_experience(5.0, sigma=0.5)  # First experience
    model.add_experience(-5.0, sigma=0.5)  # Will be squeezed
    
    print(f"Added 2 experiences")
    print(f"Cultivation after adding experiences: {model.brahma_viharas_level * 100:.1f}%")
    
    # Get initial squeezing cost
    metrics = model.get_suffering_metrics()
    initial_cost = metrics['total_squeezing_cost']
    print(f"Initial squeezing cost: {initial_cost:.2f}")
    
    # Meditate on latest experience (manual meditation, should increase cultivation)
    model.meditate_on_experience(1, 1.0, increase_cultivation=True)
    
    # Check cultivation increased
    new_cultivation = model.brahma_viharas_level
    print(f"Cultivation after meditation: {new_cultivation * 100:.1f}%")
    
    assert new_cultivation > 0.2, f"Cultivation should increase from 20%, got {new_cultivation * 100:.1f}%"
    
    # Get new squeezing cost
    metrics = model.get_suffering_metrics()
    final_cost = metrics['total_squeezing_cost']
    print(f"Final squeezing cost: {final_cost:.2f}")
    print(f"Squeezing reduced: {initial_cost - final_cost:.2f}")
    
    print("✅ Meditation button increases cultivation test passed!")


def test_automatic_meditation_no_cultivation_increase():
    """Test that automatic meditation doesn't increase cultivation"""
    print("\n=== Test 3: Automatic Meditation Doesn't Increase Cultivation ===")
    model = BayesianBeliefModel()
    
    # Set cultivation to 50%
    model.set_brahma_viharas_level(0.5)
    print(f"Initial cultivation (manual): {model.brahma_viharas_level * 100:.1f}%")
    
    # Add experiences
    model.add_experience(5.0, sigma=0.5)
    model.add_experience(-5.0, sigma=0.5)
    
    # Apply automatic meditation (simulate what happens over time)
    # This should NOT increase cultivation
    model.meditate_on_experience(1, 0.5, increase_cultivation=False)
    
    cultivation_after_auto = model.brahma_viharas_level
    print(f"Cultivation after automatic meditation: {cultivation_after_auto * 100:.1f}%")
    
    assert cultivation_after_auto == 0.5, f"Cultivation should stay at 50%, got {cultivation_after_auto * 100:.1f}%"
    
    print("✅ Automatic meditation doesn't increase cultivation test passed!")


def test_cultivation_only_adds_never_replaces():
    """Test that meditation button adds to cultivation, not replaces"""
    print("\n=== Test 4: Cultivation Adds, Never Replaces ===")
    model = BayesianBeliefModel()
    
    # Start at 50% manually
    model.set_brahma_viharas_level(0.5)
    print(f"Manual cultivation: {model.brahma_viharas_level * 100:.1f}%")
    
    # Add squeezed experiences
    model.add_experience(5.0, sigma=0.5)
    model.add_experience(-5.0, sigma=0.5)
    
    # Meditate (manual) - this should ADD to cultivation
    model.meditate_on_experience(1, 1.0, increase_cultivation=True)
    
    cultivation_after_meditation = model.brahma_viharas_level
    print(f"Cultivation after meditation: {cultivation_after_meditation * 100:.1f}%")
    
    # Should be 50% + whatever was gained from meditation
    assert cultivation_after_meditation >= 0.5, f"Should be at least 50%, got {cultivation_after_meditation * 100:.1f}%"
    
    # Manually set it lower (to 30%)
    model.set_brahma_viharas_level(0.3)
    print(f"Manual override to 30%: {model.brahma_viharas_level * 100:.1f}%")
    
    # Add more experiences and meditate again
    model.add_experience(-8.0, sigma=0.5)
    model.meditate_on_experience(2, 1.0, increase_cultivation=True)
    
    final_cultivation = model.brahma_viharas_level
    print(f"Cultivation after second meditation: {final_cultivation * 100:.1f}%")
    
    # Should have increased from 30%
    assert final_cultivation >= 0.3, f"Should be at least 30%, got {final_cultivation * 100:.1f}%"
    
    print("✅ Cultivation adds test passed!")


def test_no_feedback_loop():
    """Test that there's no feedback loop between cultivation and automatic meditation"""
    print("\n=== Test 5: No Feedback Loop ===")
    model = BayesianBeliefModel()
    
    # Set cultivation to 80%
    model.set_brahma_viharas_level(0.8)
    print(f"Manual cultivation: {model.brahma_viharas_level * 100:.1f}%")
    
    # Add an experience (will have creation_brahma_viharas_level = 0.8)
    model.add_experience(5.0, sigma=0.5)
    
    # Wait a bit to allow automatic meditation to kick in
    time.sleep(0.6)  # Past the 0.5s delay
    
    # Apply automatic meditation
    model.apply_time_based_meditation()
    
    cultivation_after_auto = model.brahma_viharas_level
    print(f"Cultivation after automatic meditation: {cultivation_after_auto * 100:.1f}%")
    
    # Should still be 80% (automatic meditation shouldn't increase it)
    assert cultivation_after_auto == 0.8, f"Should stay at 80%, got {cultivation_after_auto * 100:.1f}%"
    
    print("✅ No feedback loop test passed!")


def test_meditation_formula():
    """Test the meditation formula: floor(cost_reduction / 100) * 0.01"""
    print("\n=== Test 6: Meditation Formula ===")
    model = BayesianBeliefModel()
    
    # Start at 0%
    initial_cultivation = model.brahma_viharas_level
    print(f"Initial cultivation: {initial_cultivation * 100:.1f}%")
    
    # Add experiences that create significant squeezing
    model.add_experience(5.0, sigma=0.3)  # High charge (low sigma)
    model.add_experience(-5.0, sigma=0.3)  # High charge, will squeeze
    
    # Get squeezing cost
    metrics_before = model.get_suffering_metrics()
    cost_before = metrics_before['total_squeezing_cost']
    print(f"Squeezing cost before meditation: {cost_before:.2f}")
    
    # Meditate manually
    model.meditate_on_experience(1, 1.0, increase_cultivation=True)
    
    # Get new cost
    metrics_after = model.get_suffering_metrics()
    cost_after = metrics_after['total_squeezing_cost']
    cost_reduction = cost_before - cost_after
    print(f"Squeezing cost after meditation: {cost_after:.2f}")
    print(f"Cost reduction: {cost_reduction:.2f}")
    
    # Calculate expected cultivation increase
    expected_increase = (cost_reduction // 100) * 0.01
    print(f"Expected cultivation increase: {expected_increase * 100:.1f}%")
    
    # Check actual cultivation
    final_cultivation = model.brahma_viharas_level
    actual_increase = final_cultivation - initial_cultivation
    print(f"Actual cultivation increase: {actual_increase * 100:.1f}%")
    print(f"Final cultivation: {final_cultivation * 100:.1f}%")
    
    # Should match (with small floating point tolerance)
    assert abs(actual_increase - expected_increase) < 0.001, \
        f"Expected {expected_increase * 100:.1f}%, got {actual_increase * 100:.1f}%"
    
    print("✅ Meditation formula test passed!")


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("TESTING CULTIVATION LEVEL SYSTEM")
    print("=" * 60)
    
    try:
        test_manual_slider()
        test_meditation_button_increases_cultivation()
        test_automatic_meditation_no_cultivation_increase()
        test_cultivation_only_adds_never_replaces()
        test_no_feedback_loop()
        test_meditation_formula()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        raise
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        raise


if __name__ == "__main__":
    run_all_tests()
